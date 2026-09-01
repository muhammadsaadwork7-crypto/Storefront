const pool = require('../config/db');
const { sendOrderConfirmationEmail } = require('../utils/mailer');

exports.getAll = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin
      ? `SELECT o.*, u.name AS user_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.id DESC`
      : `SELECT o.*, u.name AS user_name FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.user_id = $1 ORDER BY o.id DESC`;
    const values = isAdmin ? [] : [req.user.id];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const order = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (order.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    if (req.user.role !== 'admin' && order.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not have access to this order' });
    }

    const items = await pool.query(
      `SELECT oi.*, p.name AS product_name
       FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );
    const payments = await pool.query('SELECT * FROM payments WHERE order_id = $1 ORDER BY id', [req.params.id]);

    res.json({ ...order.rows[0], items: items.rows, payments: payments.rows });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { status, items, payment_method, shipping_name, shipping_address, shipping_phone } = req.body;
    const user_id = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must include at least one item' });
    }
    if (!shipping_name || !shipping_address || !shipping_phone) {
      return res.status(400).json({ error: 'Shipping name, address, and phone are required' });
    }

    await client.query('BEGIN');

    // Look up product names for the email while we validate stock
    const itemsWithNames = [];
    for (const item of items) {
      const stockCheck = await client.query('SELECT stock, name FROM products WHERE id = $1', [item.product_id]);
      if (stockCheck.rows.length === 0) throw new Error(`Product ${item.product_id} not found`);
      if (stockCheck.rows[0].stock < item.quantity) {
        throw new Error(`Not enough stock for "${stockCheck.rows[0].name}" (only ${stockCheck.rows[0].stock} left)`);
      }
      itemsWithNames.push({ ...item, product_name: stockCheck.rows[0].name });
    }

    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_name, shipping_address, shipping_phone)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, total, status || 'pending', shipping_name, shipping_address, shipping_phone]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    const paymentResult = await client.query(
      'INSERT INTO payments (order_id, amount, method, status) VALUES ($1,$2,$3,$4) RETURNING *',
      [order.id, total, payment_method || 'card', 'pending']
    );

    await client.query('COMMIT');

    // Send the confirmation email — a failed email should never break a successful order
    try {
      await sendOrderConfirmationEmail(req.user.email, order, itemsWithNames);
    } catch (emailErr) {
      console.error('⚠️ Failed to send order confirmation email:', emailErr.message);
    }

    res.status(201).json({ ...order, payment: paymentResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.message.startsWith('Not enough stock') || err.message.includes('not found')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  } finally {
    client.release();
  }
};


exports.update = async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await pool.query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM orders WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
