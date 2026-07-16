const pool = require("../../../database/connection");
const InventoryRepository = require("../repositories/inventory.repository");
const AuditRepository = require("../../../database/repositories/audit.repository");
const ApiError = require("../../../utils/api-error");
const httpStatus = require("../../../constants/http-status");

class InventoryService {
  async adjustStock(variantId, quantity, type, reason, req) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Retrieve current stock with row lock
      const [rows] = await connection.query(
        "SELECT * FROM inventory WHERE variant_id = ? FOR UPDATE",
        [variantId],
      );

      if (rows.length === 0) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Inventory record not found for this variant",
        );
      }

      const inventory = rows[0];
      let newAvailableStock = inventory.available_stock;

      if (type === "IN") {
        newAvailableStock += quantity;
      } else if (type === "OUT" || type === "RESERVED") {
        if (newAvailableStock < quantity) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient stock");
        }
        newAvailableStock -= quantity;

        if (type === "RESERVED") {
          await connection.query(
            "UPDATE inventory SET reserved_stock = reserved_stock + ? WHERE variant_id = ?",
            [quantity, variantId],
          );
        }
      }

      // Update available stock
      await connection.query(
        "UPDATE inventory SET available_stock = ? WHERE variant_id = ?",
        [newAvailableStock, variantId],
      );

      // Log the transaction
      await InventoryRepository.recordTransaction(
        {
          variantId,
          type,
          quantity,
          reason,
          performedBy: req.user.id,
        },
        connection,
      );

      await connection.commit();
      AuditRepository.logAction(
        req.user.id,
        "INVENTORY_ADJUSTED",
        { variant_id: variantId, type, quantity },
        req.ip,
      );

      return { available_stock: newAvailableStock };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getInventory(queryParams) {
    const QueryBuilder = require("../../../utils/query-builder");
    const builder = new QueryBuilder("SELECT * FROM inventory", queryParams);

    // Inventory pagination logic
    const { page, limit } = builder.paginate();
    const countQuery = builder.buildCount();
    const dataQuery = builder.build();

    const [[countResult]] = await pool.query(countQuery.sql, countQuery.values);
    const [rows] = await pool.query(dataQuery.sql, dataQuery.values);

    return {
      data: rows,
      meta: {
        total: countResult.total,
        page,
        limit,
        total_pages: Math.ceil(countResult.total / limit),
      },
    };
  }
}

module.exports = new InventoryService();
