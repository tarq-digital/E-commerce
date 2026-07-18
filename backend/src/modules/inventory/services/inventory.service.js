const pool = require("../../../database/connection");
const InventoryRepository = require("../repositories/inventory.repository");
const AuditRepository = require("../../../database/repositories/audit.repository");
const ApiError = require("../../../utils/api-error");
const httpStatus = require("../../../constants/http-status");

class InventoryService {
  async getInventory(queryParams) {
    return await InventoryRepository.findAll(queryParams);
  }

  async getInventoryByVariantId(variantId, warehouseId = 1) {
    const inventory = await InventoryRepository.findByVariantId(variantId, warehouseId);
    if (!inventory) {
      throw new ApiError(httpStatus.NOT_FOUND, "Inventory record not found for this variant");
    }
    return inventory;
  }

  async adjustStock(variantId, warehouseId = 1, quantity, type, reason, req) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Retrieve current stock with row lock
      const [rows] = await connection.query(
        "SELECT * FROM inventory WHERE variant_id = ? AND warehouse_id = ? FOR UPDATE",
        [variantId, warehouseId],
      );

      if (rows.length === 0) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Inventory record not found for this variant and warehouse",
        );
      }

      const inventory = rows[0];

      // Validate quantities for OUT and RESERVED
      if (type === "OUT" || type === "RESERVED") {
        if (inventory.available_stock < quantity) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient stock");
        }
      }

      // Delegate update to repository
      await InventoryRepository.adjustStock(
        variantId, 
        warehouseId, 
        quantity, 
        type, 
        reason, 
        req.user.id, 
        null, 
        connection
      );

      await connection.commit();

      AuditRepository.logAction(
        req.user.id,
        "INVENTORY_ADJUSTED",
        { variant_id: variantId, warehouse_id: warehouseId, type, quantity },
        req.ip,
      );

      return await this.getInventoryByVariantId(variantId, warehouseId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Called during checkout/order confirmation
  async reserveStock(variantId, warehouseId = 1, quantity, orderId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [rows] = await connection.query(
        "SELECT * FROM inventory WHERE variant_id = ? AND warehouse_id = ? FOR UPDATE",
        [variantId, warehouseId]
      );
      if (!rows.length || rows[0].available_stock < quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient stock for reservation");
      }

      await InventoryRepository.adjustStock(
        variantId, warehouseId, quantity, 'RESERVED', 'Order Placed', null, orderId, connection
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new InventoryService();
