const express = require('express');
const router = express.Router();
const controller = require('../controllers/payments.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Payments are back-office data — admin-only for all operations.
router.get('/', requireAuth, requireAdmin, controller.getAll);
router.get('/:id', requireAuth, requireAdmin, controller.getOne);
router.post('/', requireAuth, requireAdmin, controller.create);
router.put('/:id', requireAuth, requireAdmin, controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

module.exports = router;
