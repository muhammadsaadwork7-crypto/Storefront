const express = require('express');
const router = express.Router();
const controller = require('../controllers/orders.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Every order route requires login. The controller scopes results/creation
// to req.user unless the caller is an admin.
router.get('/', requireAuth, controller.getAll);
router.get('/:id', requireAuth, controller.getOne);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, requireAdmin, controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

module.exports = router;
