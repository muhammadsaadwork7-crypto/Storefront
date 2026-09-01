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
    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, s.name AS supplier_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    const product = result.rows[0];

    const mediaResult = await pool.query(
      'SELECT * FROM product_media WHERE product_id = $1 ORDER BY sort_order, id',
      [product.id]
    );

    // Fall back to the single legacy image_url if no gallery media exists yet
    product.media = mediaResult.rows.length > 0
      ? mediaResult.rows
      : product.image_url
        ? [{ id: 0, media_type: 'image', url: product.image_url }]
        : [];

    res.json(product);
  } catch (err) {
    next(err);
  }
};


exports.create = async (req, res, next) => {
  try {
    const { name, category_id, supplier_id, price, stock, description } = req.body;
    if (!name || !Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ error: 'Name, non-negative price, and non-negative integer stock are required' });
    }
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
    if (!name || !Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ error: 'Name, non-negative price, and non-negative integer stock are required' });
    }
    const imageExpression = req.file ? '$6' : 'image_url';
    const imageValue = req.file ? `/uploads/${req.file.filename}` : undefined;

    const result = await pool.query(
      `UPDATE products SET name=$1, category_id=$2, supplier_id=$3, price=$4, stock=$5, image_url=${imageExpression}, description=$7
       WHERE id=$8 RETURNING *`,
      [name, category_id, supplier_id, price, stock, imageValue, description, req.params.id]
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
