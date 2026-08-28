const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getProducts,
    getFeaturedProducts,
    getProductById,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    moderateProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/supplier/my-products', protect, authorize('supplier', 'admin'), getMyProducts);
router.get('/:id', getProductById);

// Protected routes (Supplier & Admin)
router.post('/', protect, authorize('supplier', 'admin'), createProduct);
router.put('/:id', protect, authorize('supplier', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('supplier', 'admin'), deleteProduct);

// Admin-only moderation
router.patch('/:id/moderate', protect, authorize('admin'), moderateProduct);

module.exports = router;
