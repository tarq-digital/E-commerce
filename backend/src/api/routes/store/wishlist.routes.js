const express = require('express');
const { requireAuth } = require('../../../middlewares/auth.middleware');
const { sendSuccess } = require('../../../utils/response');
const httpStatus = require('../../../constants/http-status');
const pool = require('../../../database/connection');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.* FROM products p
            JOIN wishlists w ON w.product_id = p.id
            WHERE w.user_id = ?
        `, [req.user.id]);
        
        sendSuccess(res, httpStatus.OK, 'Wishlist retrieved', rows);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { product_id } = req.body;
        await pool.query('INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)', [req.user.id, product_id]);
        sendSuccess(res, httpStatus.OK, 'Added to wishlist');
    } catch (e) {
        next(e);
    }
});

router.delete('/:productId', async (req, res, next) => {
    try {
        await pool.query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
        sendSuccess(res, httpStatus.OK, 'Removed from wishlist');
    } catch (e) {
        next(e);
    }
});

module.exports = router;
