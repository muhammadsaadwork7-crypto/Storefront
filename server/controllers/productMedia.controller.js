const pool = require('../config/db');

// Get all media for a product, in display order
exports.getMedia = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM product_media WHERE product_id = $1 ORDER BY sort_order, id',
      [req.params.productId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Upload one or more images/videos for a product
exports.uploadMedia = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    // Find the current highest sort_order for this product so new items go to the end
    const existing = await pool.query(
      'SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM product_media WHERE product_id = $1',
      [productId]
    );
    let nextOrder = existing.rows[0].max_order + 1;

    const inserted = [];
    for (const file of req.files) {
      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
      const url = `/uploads/${file.filename}`;
      const result = await pool.query(
        'INSERT INTO product_media (product_id, media_type, url, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
        [productId, mediaType, url, nextOrder]
      );
      inserted.push(result.rows[0]);
      nextOrder++;
    }

    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
};

// Remove a single media item
exports.removeMedia = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM product_media WHERE id = $1 RETURNING *',
      [req.params.mediaId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Media not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
