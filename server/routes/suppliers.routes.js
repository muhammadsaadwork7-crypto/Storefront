const express = require('express');
const router = express.Router();
const controller = require('../controllers/suppliers.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', requireAuth, requireAdmin, controller.create);
router.put('/:id', requireAuth, requireAdmin, controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

module.exports = router;
