const express = require('express');
const {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkoutCart,
} = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addCartItem);
router.post('/add', authMiddleware, addCartItem);
router.put('/:productId', authMiddleware, updateCartItem);
router.delete('/remove/:productId', authMiddleware, removeCartItem);
router.delete('/:productId', authMiddleware, removeCartItem);
router.delete('/', authMiddleware, clearCart);
router.post('/checkout', authMiddleware, checkoutCart);

module.exports = router;
