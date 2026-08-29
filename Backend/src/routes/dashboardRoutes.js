const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getDashboardOverview,
    getCustomerDashboard,
    getSupplierDashboard,
    getAdminDashboard
} = require('../controllers/dashboardController');

router.use(protect);
router.get('/', getDashboardOverview);
router.get('/customer', authorize('customer'), getCustomerDashboard);
router.get('/supplier', authorize('supplier', 'admin'), getSupplierDashboard);
router.get('/admin', authorize('admin'), getAdminDashboard);

module.exports = router;
