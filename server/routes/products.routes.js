const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');
const upload = require('../middleware/upload');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', requireAuth, requireAdmin, upload.single('image'), controller.create);
router.put('/:id', requireAuth, requireAdmin, upload.single('image'), controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

module.exports = router;
