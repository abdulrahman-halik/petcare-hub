const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middlewares/authMiddleware');
const {
    getPayPalConfig,
    createPayPalOrder,
    capturePayPalOrder,
    createPaymentIntent,
    mockPayment
} = require('../controllers/paymentController');

// Public or optional auth for retrieving PayPal client ID
router.get('/paypal/config', optionalAuth, getPayPalConfig);

// Protected routes
router.post('/paypal/create-order', protect, createPayPalOrder);
router.post('/paypal/capture-order', protect, capturePayPalOrder);

// Mock payment routes for developer staging/testing
router.post('/intent', protect, createPaymentIntent);
router.post('/mock', protect, mockPayment);

module.exports = router;
