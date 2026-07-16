const BrandRepository = require("../repositories/brand.repository");
const AuditRepository = require("../../../database/repositories/audit.repository");
const { generateSlug } = require("../../../utils/slug");
const ApiError = require("../../../utils/api-error");
const httpStatus = require("../../../constants/http-status");

class BrandService {
  async getBrands(queryParams) {
    return BrandRepository.findAll(queryParams);
  }

  async getBrandById(id) {
    const brand = await BrandRepository.findById(id);
    if (!brand) {
      throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
    }
    return brand;
  }

  async createBrand(data, req) {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

    const existing = await BrandRepository.findBySlug(slug);
    if (existing) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Brand with this slug already exists",
      );
    }

    const brand = await BrandRepository.create({ ...data, slug });
    AuditRepository.logAction(
      req.user.id,
      "BRAND_CREATED",
      { brand_id: brand.id },
      req.ip,
    );

    return brand;
  }

  async updateBrand(id, data, req) {
    await this.getBrandById(id);

    if (data.slug || data.name) {
      data.slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

      const existing = await BrandRepository.findBySlug(data.slug);
      if (existing && existing.id !== parseInt(id)) {
        throw new ApiError(
          httpStatus.CONFLICT,
          "Brand with this slug already exists",
        );
      }
    }

    const updated = await BrandRepository.update(id, data);
    AuditRepository.logAction(
      req.user.id,
      "BRAND_UPDATED",
      { brand_id: id },
      req.ip,
    );
    return updated;
  }

  async deleteBrand(id, req) {
    await this.getBrandById(id);
    await BrandRepository.softDelete(id);
    AuditRepository.logAction(
      req.user.id,
      "BRAND_DELETED",
      { brand_id: id },
      req.ip,
    );
  }

  async restoreBrand(id, req) {
    const restored = await BrandRepository.restore(id);
    AuditRepository.logAction(
      req.user.id,
      "BRAND_RESTORED",
      { brand_id: id },
      req.ip,
    );
    return restored;
  }
}

module.exports = new BrandService();
