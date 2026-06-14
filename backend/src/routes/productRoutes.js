const express = require('express');
const { getProducts, getProductById, getMyProducts, createProduct, getProductCategories } = require('../controllers/productController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/categories', getProductCategories);
router.get('/', getProducts);
router.get('/wishlist', authMiddleware, require('../controllers/productController').getWishlistProducts);
router.get('/mine', authMiddleware, getMyProducts);
router.post('/', authMiddleware, upload.array('images', 5), createProduct);
router.get('/:id', getProductById);
router.put('/:id', authMiddleware, upload.array('images', 5), require('../controllers/productController').updateProduct);
router.delete('/:id', authMiddleware, require('../controllers/productController').deleteProduct);

module.exports = router;
