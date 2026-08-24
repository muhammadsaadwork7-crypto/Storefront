const pool = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    const result = await pool.query(
      'INSERT INTO suppliers (name, email, phone, address) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, phone, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    const result = await pool.query(
      'UPDATE suppliers SET name=$1, email=$2, phone=$3, address=$4 WHERE id=$5 RETURNING *',
      [name, email, phone, address, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM suppliers WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
