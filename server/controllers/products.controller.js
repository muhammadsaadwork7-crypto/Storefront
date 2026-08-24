const pool = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name AS category_name, s.name AS supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);
  try {
    const { name, category_id, supplier_id, price, stock, description } = req.body;
    // If a file was uploaded via multer, req.file will be set
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;

    const result = await pool.query(
      `INSERT INTO products (name, category_id, supplier_id, price, stock, image_url, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, category_id, supplier_id, price, stock, image_url, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, category_id, supplier_id, price, stock, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;

    const result = await pool.query(
      `UPDATE products SET name=$1, category_id=$2, supplier_id=$3, price=$4, stock=$5, image_url=$6, description=$7
       WHERE id=$8 RETURNING *`,
      [name, category_id, supplier_id, price, stock, image_url, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
