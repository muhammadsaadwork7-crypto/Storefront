const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller');
const { requireAuth } = require('../middleware/auth');

// Cart is always tied to the logged-in user — no userId in the URL needed
// for the current user's own cart anymore, but we keep :userId for admin visibility.
router.get('/:userId', requireAuth, controller.getCart);
router.post('/', requireAuth, controller.addToCart);
router.put('/:id', requireAuth, controller.updateQuantity);
router.delete('/:id', requireAuth, controller.removeFromCart);
router.delete('/user/:userId', requireAuth, controller.clearCart);

module.exports = router;
