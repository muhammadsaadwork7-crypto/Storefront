const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// All user management is admin-only. Customers self-register via /api/auth/register.
router.get('/', requireAuth, requireAdmin, controller.getAll);
router.get('/:id', requireAuth, requireAdmin, controller.getOne);
router.post('/', requireAuth, requireAdmin, controller.create);
router.put('/:id', requireAuth, requireAdmin, controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

module.exports = router;
