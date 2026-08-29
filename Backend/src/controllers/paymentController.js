const crypto = require('crypto');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const generateMockTransactionId = () => `mock_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

// @desc    Create a mock payment intent (validates cart + returns intent)
// @route   POST /api/payments/intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ status: 'fail', message: 'Cart is empty' });
        }

        // Validate every item's stock from DB
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product || product.status !== 'active') {
                return res.status(400).json({
                    status: 'fail',
                    message: `Product "${item.name}" is no longer available`
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Insufficient stock for "${item.name}". Available: ${product.stock}`
                });
            }
        }

        // Recalculate totals server-side (never trust cart totals blindly)
        const TAX_RATE = 0.10;
        const FREE_SHIPPING_THRESHOLD = 50;
        const FLAT_SHIPPING = 5;

        let subtotal = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            subtotal += product.price * item.quantity;
        }
        subtotal = Math.round(subtotal * 100) / 100;
        const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
        const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
        const total = Math.round((subtotal + tax + shippingFee) * 100) / 100;

        const intentId = generateMockTransactionId();

        res.status(200).json({
            status: 'success',
            data: {
                intentId,
                amount: total,
                subtotal,
                tax,
                shippingFee,
                currency: 'usd'
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Mock payment confirmation (simulates Stripe confirm)
// @route   POST /api/payments/mock
// @access  Private
exports.mockPayment = async (req, res) => {
    try {
        const { intentId, simulateFailure = false } = req.body;

        if (!intentId) {
            return res.status(400).json({ status: 'fail', message: 'Payment intent ID is required' });
        }

        // Simulate payment outcome
        if (simulateFailure) {
            return res.status(402).json({
                status: 'fail',
                message: 'Payment declined (simulated failure)',
                data: { transactionId: intentId, paymentStatus: 'failed' }
            });
        }

        // Successful mock payment
        res.status(200).json({
            status: 'success',
            message: 'Payment successful',
            data: {
                transactionId: intentId,
                status: 'paid',          // used by orderController
                paymentStatus: 'paid',   // display alias
                provider: 'mock',
                paidAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
