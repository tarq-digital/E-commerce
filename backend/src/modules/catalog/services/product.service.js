const pool = require("../../../database/connection");
const ProductRepository = require("../repositories/product.repository");
const VariantRepository = require("../repositories/variant.repository");
const InventoryRepository = require("../../inventory/repositories/inventory.repository");
const MediaRepository = require("../../media/repositories/media.repository");
const AuditRepository = require("../../../database/repositories/audit.repository");
const MediaService = require("../../media/services/media.service");
const { generateSlug } = require("../../../utils/slug");
const ApiError = require("../../../utils/api-error");
const httpStatus = require("../../../constants/http-status");

class ProductService {
  async getProducts(queryParams) {
    return ProductRepository.findAll(queryParams);
  }

  async getProductBySlug(slug) {
    const product = await ProductRepository.findBySlugOrSku(slug);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    return product;
  }

  async createProductWithVariantsAndImages(data, files, req) {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

    // 1. Validation (Unique constraint checks)
    const existing = await ProductRepository.findBySlugOrSku(slug); // Basic check, could also check SKU explicitly
    if (existing) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Product with this slug or SKU already exists",
      );
    }

    const connection = await pool.getConnection();

    try {
      // 2. Start Transaction
      await connection.beginTransaction();

      // 3. Create Product
      const productId = await ProductRepository.createProduct(
        { ...data, slug },
        connection,
      );

      // 4. Handle Tags & Specs
      if (data.tags)
        await ProductRepository.createTags(productId, data.tags, connection);
      if (data.specs)
        await ProductRepository.createSpecifications(
          productId,
          data.specs,
          connection,
        );

      // 5. Create Base Variant (For simple products)
      const variantId = await VariantRepository.createVariant(
        {
          product_id: productId,
          sku: data.sku,
          price: data.base_price,
          barcode: data.barcode || null,
          weight: data.weight || null,
        },
        connection,
      );

      // 6. Initialize Inventory Ledger
      await InventoryRepository.initializeInventory(
        variantId,
        data.initial_stock,
        data.low_stock_threshold,
        connection,
      );

      // 7. Handle Cloudinary Uploads if files exist
      if (files && files.length > 0) {
        // We do network call outside transaction lock ideally, but for MVP consistency we do it here.
        // In highly concurrent production, upload first, then run TX.
        const uploadedImages = await MediaService.uploadImages(
          files,
          `weebster/products/${data.sku}`,
        );
        await MediaRepository.addProductImages(
          productId,
          variantId,
          uploadedImages,
          connection,
        );
      }

      // 8. Commit Transaction
      await connection.commit();

      AuditRepository.logAction(
        req.user.id,
        "PRODUCT_CREATED",
        { product_id: productId },
        req.ip,
      );

      return await ProductRepository.findById(productId);
    } catch (error) {
      // 9. Rollback on any failure
      await connection.rollback();
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create product. Transaction rolled back.",
        "TX_FAILED",
        true,
        error.stack,
      );
    } finally {
      connection.release();
    }
  }

  async deleteProduct(id, req) {
    const product = await ProductRepository.findById(id);
    if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

    await ProductRepository.softDelete(id);
    AuditRepository.logAction(
      req.user.id,
      "PRODUCT_ARCHIVED",
      { product_id: id },
      req.ip,
    );
  }
}

module.exports = new ProductService();
