const express = require('express');
const router = express.Router();
const controller = require('../controllers/productMedia.controller');
const uploadMedia = require('../middleware/uploadMedia');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/:productId', controller.getMedia);
router.post('/:productId', requireAuth, requireAdmin, uploadMedia.array('media', 10), controller.uploadMedia);
router.delete('/:mediaId', requireAuth, requireAdmin, controller.removeMedia);

module.exports = router;
