class InventoryRepository {
  /**
   * Initializes base inventory for a newly created variant
   */
  async initializeInventory(
    variantId,
    availableStock,
    lowStockThreshold,
    connection,
  ) {
    await connection.query(
      `INSERT INTO inventory (variant_id, available_stock, low_stock_threshold) 
       VALUES (?, ?, ?)`,
      [variantId, availableStock || 0, lowStockThreshold || 10],
    );

    if (availableStock > 0) {
      await this.recordTransaction(
        {
          variantId,
          type: "IN",
          quantity: availableStock,
          reason: "Initial stock",
        },
        connection,
      );
    }
  }

  async recordTransaction(
    { variantId, type, quantity, reason, referenceId, performedBy },
    connection,
  ) {
    await connection.query(
      `INSERT INTO inventory_transactions 
       (variant_id, type, quantity, reason, reference_id, performed_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [variantId, type, quantity, reason, referenceId, performedBy],
    );
  }
}

module.exports = new InventoryRepository();
