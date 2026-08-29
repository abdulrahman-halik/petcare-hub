const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createPaymentIntent, mockPayment } = require('../controllers/paymentController');

router.use(protect);

router.post('/intent', createPaymentIntent);
router.post('/mock', mockPayment);

module.exports = router;
