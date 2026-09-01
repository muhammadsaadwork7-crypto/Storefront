const pool = require('../config/db');

exports.getCart = async (req, res, next) => {
  try {
    // Customers can only ever fetch their own cart; admins can check any cart via the URL.
    const targetUserId = req.user.role === 'admin' ? req.params.userId : req.user.id;

    const result = await pool.query(
      `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.stock, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.id`,
      [targetUserId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id; // always the logged-in user
    if (!product_id) return res.status(400).json({ error: 'product_id is required' });
    const requestedQuantity = quantity ?? 1;
    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }

    const product = await pool.query('SELECT stock FROM products WHERE id = $1', [product_id]);
    if (product.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    if (product.rows[0].stock < requestedQuantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [user_id, product_id, requestedQuantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }
    const result = await pool.query(
      `UPDATE cart_items ci SET quantity = $1
       FROM products p
       WHERE ci.id = $2 AND ci.user_id = $3 AND ci.product_id = p.id AND $1 <= p.stock
       RETURNING ci.*`,
      [quantity, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found or quantity exceeds stock' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const targetUserId = req.user.role === 'admin' ? req.params.userId : req.user.id;
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [targetUserId]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};
