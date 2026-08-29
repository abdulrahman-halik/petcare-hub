const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { createOrder, getMyOrders, getOrderById, getAllOrders } = require('../controllers/orderController');

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/admin/all', authorize('admin'), getAllOrders);
router.get('/:orderId', getOrderById);

module.exports = router;
