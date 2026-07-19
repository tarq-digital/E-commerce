const mysql = require('mysql2/promise');

async function auditCart() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Sumit@10042006',
    database: 'weebster_dev'
  });

  try {
    // 1. Print a representative cart that has items (we'll look at all active carts)
    const [carts] = await connection.query(`SELECT * FROM carts WHERE status = 'ACTIVE'`);
    console.log("=== Cart Contents ===");
    
    for (const cart of carts) {
      console.log(`\\nCart ID: ${cart.id}, User: ${cart.user_id}, Token: ${cart.cart_token}`);
      
      const [items] = await connection.query(`
        SELECT 
          ci.id as cart_item_id,
          ci.quantity,
          ci.product_snapshot_name,
          ci.product_id,
          ci.variant_id,
          p.status as product_status,
          pv.deleted_at as variant_deleted,
          i.available_stock
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        LEFT JOIN product_variants pv ON ci.variant_id = pv.id
        LEFT JOIN inventory i ON (ci.variant_id IS NOT NULL AND i.variant_id = ci.variant_id)
        WHERE ci.cart_id = ?
      `, [cart.id]);

      if (items.length === 0) {
        console.log('No items in this cart.');
        continue;
      }

      for (const item of items) {
        console.log(`\\n- Product: ${item.product_snapshot_name} (ID: ${item.product_id})`);
        console.log(`  Requested Quantity: ${item.quantity}`);
        console.log(`  Available Stock: ${item.available_stock}`);
        console.log(`  Product Status (is_active/published): ${item.product_status}`);
        console.log(`  Variant Deleted: ${item.variant_deleted}`);

        let rejected = false;
        if (item.product_status !== 'PUBLISHED' || item.variant_deleted !== null) {
          console.log(`  Validation: ✗ Rejected because product is inactive or deleted.`);
          rejected = true;
        } else {
          const maxStock = item.available_stock || 0;
          if (maxStock <= 0) {
             console.log(`  Validation: ✗ Rejected because stock = 0.`);
             rejected = true;
          } else if (item.quantity > maxStock) {
             console.log(`  Validation: ⚠ Quantity exceeds stock (Requested: ${item.quantity}, Max: ${maxStock}). It would be reduced.`);
          } else {
             console.log(`  Validation: ✓ Valid`);
          }
        }
      }
    }
    
    // Also let's check general inventory for seed data issues
    console.log("\\n=== Dummy Seed Data Inventory Check ===");
    const [inventory] = await connection.query(`
      SELECT i.variant_id, i.available_stock, p.name as product_name, p.status
      FROM inventory i
      JOIN product_variants pv ON i.variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
    `);
    
    for (const inv of inventory) {
      if (inv.available_stock <= 0) {
        console.log(`- Product: ${inv.product_name} (Variant ${inv.variant_id}) | Status: ${inv.status} | Stock: ${inv.available_stock} -> ZERO INVENTORY IN SEED`);
      }
    }
    
  } catch(e) {
    console.error(e);
  } finally {
    await connection.end();
  }
}

auditCart();
