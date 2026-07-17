const pool = require('../../../database/connection');

class CartRepository {
  /**
   * Get an active cart by User ID or Guest Token
   */
  async getActiveCart(userId = null, cartToken = null) {
    let query = `SELECT * FROM carts WHERE status = 'ACTIVE'`;
    let params = [];
    
    if (userId) {
      query += ` AND user_id = ?`;
      params.push(userId);
    } else if (cartToken) {
      query += ` AND cart_token = ?`;
      params.push(cartToken);
    } else {
      return null;
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
  }

  /**
   * Create a new active cart
   */
  async createCart(userId = null, cartToken = null) {
    const query = `
      INSERT INTO carts (user_id, cart_token)
      VALUES (?, ?)
    `;
    const [result] = await pool.query(query, [userId, cartToken]);
    return result.insertId;
  }

  /**
   * Get cart items joined with dynamic product/variant data
   */
  async getCartItems(cartId) {
    // We join products and variants to get the TRUE DYNAMIC price and stock.
    // The snapshotted name/sku from cart_items is returned as well.
    const query = `
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        ci.product_snapshot_name,
        ci.product_snapshot_sku,
        ci.selected_variant_name,
        ci.selected_variant_values,
        ci.metadata,
        p.id as product_id,
        p.slug as product_slug,
        p.base_price as dynamic_product_price,
        p.compare_at_price as dynamic_product_compare,
        p.status as product_status,
        pv.id as variant_id,
        pv.price as dynamic_variant_price,
        pv.sku as dynamic_variant_sku,
        pv.deleted_at as variant_deleted,
        i.available_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      LEFT JOIN inventory i ON (
        (ci.variant_id IS NOT NULL AND i.variant_id = ci.variant_id) OR
        (ci.variant_id IS NULL AND i.product_id = ci.product_id)
      )
      WHERE ci.cart_id = ?
    `;
    const [items] = await pool.query(query, [cartId]);
    return items;
  }

  /**
   * Check if an exact item exists in the cart
   */
  async findCartItem(cartId, productId, variantId = null) {
    let query = `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`;
    let params = [cartId, productId];

    if (variantId) {
      query += ` AND variant_id = ?`;
      params.push(variantId);
    } else {
      query += ` AND variant_id IS NULL`;
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
  }

  /**
   * Add new item to cart
   */
  async addCartItem(cartId, data) {
    const query = `
      INSERT INTO cart_items (
        cart_id, product_id, variant_id, quantity, 
        product_snapshot_name, product_snapshot_sku, 
        selected_variant_name, selected_variant_values, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      cartId, 
      data.product_id, 
      data.variant_id || null, 
      data.quantity,
      data.product_snapshot_name,
      data.product_snapshot_sku,
      data.selected_variant_name || null,
      data.selected_variant_values ? JSON.stringify(data.selected_variant_values) : null,
      data.metadata ? JSON.stringify(data.metadata) : null
    ];
    const [result] = await pool.query(query, params);
    
    // Touch cart updated_at
    await this.touchCart(cartId);
    
    return result.insertId;
  }

  /**
   * Update quantity of an existing item
   */
  async updateCartItemQuantity(cartItemId, quantity) {
    const query = `UPDATE cart_items SET quantity = ? WHERE id = ?`;
    await pool.query(query, [quantity, cartItemId]);
    
    // Need to touch cart as well, but we need the cart_id.
    const [rows] = await pool.query('SELECT cart_id FROM cart_items WHERE id = ?', [cartItemId]);
    if (rows[0]) await this.touchCart(rows[0].cart_id);
  }

  /**
   * Remove item from cart
   */
  async removeCartItem(cartItemId) {
    const [rows] = await pool.query('SELECT cart_id FROM cart_items WHERE id = ?', [cartItemId]);
    const cartId = rows[0]?.cart_id;
    
    const query = `DELETE FROM cart_items WHERE id = ?`;
    await pool.query(query, [cartItemId]);
    
    if (cartId) await this.touchCart(cartId);
  }

  /**
   * Remove specific items by ID
   */
  async bulkRemoveCartItems(cartItemIds) {
    if (!cartItemIds || cartItemIds.length === 0) return;
    const placeholders = cartItemIds.map(() => '?').join(',');
    await pool.query(`DELETE FROM cart_items WHERE id IN (${placeholders})`, cartItemIds);
  }

  /**
   * Clear all items in a cart
   */
  async clearCartItems(cartId) {
    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    await this.touchCart(cartId);
  }

  /**
   * Set cart to a different status (e.g., CONVERTED)
   */
  async updateCartStatus(cartId, status) {
    await pool.query('UPDATE carts SET status = ? WHERE id = ?', [status, cartId]);
  }

  /**
   * Touch updated_at for a cart
   */
  async touchCart(cartId) {
    await pool.query('UPDATE carts SET updated_at = NOW() WHERE id = ?', [cartId]);
  }

  /**
   * Merge guest cart into user cart
   */
  async mergeGuestCart(guestCartToken, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Get Guest Cart
      const [guestCarts] = await connection.query(
        'SELECT id FROM carts WHERE cart_token = ? AND status = "ACTIVE"',
        [guestCartToken]
      );
      if (!guestCarts.length) {
        await connection.rollback();
        return false;
      }
      const guestCartId = guestCarts[0].id;

      // 2. Get User Cart
      const [userCarts] = await connection.query(
        'SELECT id FROM carts WHERE user_id = ? AND status = "ACTIVE"',
        [userId]
      );
      
      let userCartId;
      if (!userCarts.length) {
        // Just assign the guest cart to the user
        await connection.query(
          'UPDATE carts SET user_id = ?, cart_token = NULL WHERE id = ?',
          [userId, guestCartId]
        );
        userCartId = guestCartId;
      } else {
        userCartId = userCarts[0].id;
        
        // 3. Move items from guest cart to user cart
        const [guestItems] = await connection.query('SELECT * FROM cart_items WHERE cart_id = ?', [guestCartId]);
        
        for (const item of guestItems) {
          // Check if item already exists in user cart
          let checkQuery = 'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?';
          let checkParams = [userCartId, item.product_id];
          if (item.variant_id) {
            checkQuery += ' AND variant_id = ?';
            checkParams.push(item.variant_id);
          } else {
            checkQuery += ' AND variant_id IS NULL';
          }

          const [existing] = await connection.query(checkQuery, checkParams);

          if (existing.length > 0) {
            // Update quantity
            await connection.query(
              'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
              [item.quantity, existing[0].id]
            );
          } else {
            // Insert new
            await connection.query(`
              INSERT INTO cart_items (
                cart_id, product_id, variant_id, quantity, 
                product_snapshot_name, product_snapshot_sku, 
                selected_variant_name, selected_variant_values, metadata
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              userCartId, item.product_id, item.variant_id, item.quantity,
              item.product_snapshot_name, item.product_snapshot_sku,
              item.selected_variant_name, item.selected_variant_values ? JSON.stringify(item.selected_variant_values) : null,
              item.metadata ? JSON.stringify(item.metadata) : null
            ]);
          }
        }
        
        // Abandon old guest cart
        await connection.query('UPDATE carts SET status = "ABANDONED", cart_token = NULL WHERE id = ?', [guestCartId]);
      }

      await connection.query('UPDATE carts SET updated_at = NOW() WHERE id = ?', [userCartId]);
      
      await connection.commit();
      return userCartId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

}

module.exports = new CartRepository();
