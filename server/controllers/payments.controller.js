const pool = require('../config/db');

const syncOrderTotal = async (orderId) => {
  const totalResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0)::numeric(10,2) AS total_amount
     FROM payments
     WHERE order_id = $1`,
    [orderId]
  );

  await pool.query('UPDATE orders SET total_amount = $1 WHERE id = $2', [
    totalResult.rows[0].total_amount,
    orderId,
  ]);
};

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT pay.*, o.total_amount AS order_total
      FROM payments pay
      LEFT JOIN orders o ON pay.order_id = o.id
      ORDER BY pay.id
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM payments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { order_id, amount, method, status } = req.body;
    const result = await pool.query(
      'INSERT INTO payments (order_id, amount, method, status) VALUES ($1,$2,$3,$4) RETURNING *',
      [order_id, amount, method || 'card', status || 'pending']
    );
    await syncOrderTotal(order_id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { amount, method, status } = req.body;
    const result = await pool.query(
      'UPDATE payments SET amount=$1, method=$2, status=$3 WHERE id=$4 RETURNING *',
      [amount, method, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    await syncOrderTotal(result.rows[0].order_id);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const payment = await pool.query('SELECT order_id FROM payments WHERE id = $1', [req.params.id]);
    if (payment.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    await pool.query('DELETE FROM payments WHERE id=$1 RETURNING *', [req.params.id]);
    await syncOrderTotal(payment.rows[0].order_id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
