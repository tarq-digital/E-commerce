const pool = require("../../../database/connection");
const QueryBuilder = require("../../../utils/query-builder");

class InventoryRepository {
  /**
   * Initializes base inventory for a newly created variant
   */
  async initializeInventory(
    variantId,
    availableStock,
    lowStockThreshold,
    connection,
    warehouseId = 1
  ) {
    await connection.query(
      `INSERT INTO inventory (variant_id, warehouse_id, available_stock, low_stock_threshold) 
       VALUES (?, ?, ?, ?)`,
      [variantId, warehouseId, availableStock || 0, lowStockThreshold || 10],
    );

    if (availableStock > 0) {
      await this.recordTransaction(
        {
          variantId,
          warehouseId,
          type: "IN",
          quantity: availableStock,
          reason: "Initial stock",
        },
        connection,
      );
    }
  }

  async recordTransaction(
    { variantId, warehouseId = 1, type, quantity, reason, referenceId, performedBy },
    connection,
  ) {
    const db = connection || pool;
    await db.query(
      `INSERT INTO inventory_transactions 
       (variant_id, warehouse_id, type, quantity, reason, reference_id, performed_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [variantId, warehouseId, type, quantity, reason, referenceId, performedBy],
    );
  }

  async findAll(queryParams) {
    const baseQuery = `
      SELECT 
        i.id as inventory_id,
        i.variant_id,
        i.warehouse_id,
        i.available_stock,
        i.reserved_stock,
        i.low_stock_threshold,
        i.updated_at,
        pv.sku,
        pv.price,
        p.name as product_name,
        p.id as product_id,
        w.name as warehouse_name,
        (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = TRUE LIMIT 1) as image_url
      FROM inventory i
      JOIN product_variants pv ON i.variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
    `;
    
    const builder = new QueryBuilder(baseQuery, queryParams);
    builder
      .search(["pv.sku", "p.name"])
      .sort("i.updated_at DESC");

    // Handle low stock filter
    if (queryParams.low_stock === 'true') {
      builder.where("i.available_stock <= i.low_stock_threshold");
    }

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

  async findByVariantId(variantId, warehouseId = 1) {
    const [rows] = await pool.query(`
      SELECT 
        i.*,
        pv.sku,
        p.name as product_name,
        w.name as warehouse_name
      FROM inventory i
      JOIN product_variants pv ON i.variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      WHERE i.variant_id = ? AND i.warehouse_id = ?
    `, [variantId, warehouseId]);

    if (!rows.length) return null;

    const inventory = rows[0];

    const [transactions] = await pool.query(`
      SELECT it.*, u.first_name, u.last_name
      FROM inventory_transactions it
      LEFT JOIN users u ON it.performed_by = u.id
      WHERE it.variant_id = ? AND it.warehouse_id = ?
      ORDER BY it.created_at DESC
      LIMIT 100
    `, [variantId, warehouseId]);

    inventory.transactions = transactions;
    return inventory;
  }

  async adjustStock(variantId, warehouseId, quantity, type, reason, performedBy, referenceId = null, connection = null) {
    const db = connection || pool;
    
    let updateQuery = "";
    if (type === 'IN') {
      updateQuery = "UPDATE inventory SET available_stock = available_stock + ? WHERE variant_id = ? AND warehouse_id = ?";
    } else if (type === 'OUT') {
      // Out deductions from reserved stock if it was an order fulfillment
      updateQuery = "UPDATE inventory SET reserved_stock = reserved_stock - ? WHERE variant_id = ? AND warehouse_id = ?";
    } else if (type === 'RESERVED') {
      updateQuery = "UPDATE inventory SET available_stock = available_stock - ?, reserved_stock = reserved_stock + ? WHERE variant_id = ? AND warehouse_id = ?";
    } else if (type === 'RELEASED') {
      updateQuery = "UPDATE inventory SET available_stock = available_stock + ?, reserved_stock = reserved_stock - ? WHERE variant_id = ? AND warehouse_id = ?";
    } else if (type === 'ADJUSTMENT') {
      // Directly set the available stock for a manual correction
      updateQuery = "UPDATE inventory SET available_stock = ? WHERE variant_id = ? AND warehouse_id = ?";
    }

    if (type === 'RESERVED' || type === 'RELEASED') {
        await db.query(updateQuery, [quantity, quantity, variantId, warehouseId]);
    } else {
        await db.query(updateQuery, [quantity, variantId, warehouseId]);
    }

    await this.recordTransaction({
      variantId, warehouseId, type, quantity, reason, referenceId, performedBy
    }, db);
  }
}

module.exports = new InventoryRepository();
