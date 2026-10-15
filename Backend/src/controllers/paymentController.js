const crypto = require('crypto');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const paypalService = require('../services/paypalService');
const { buildAndValidateOrderItems, decrementProductInventory } = require('../services/orderService');
const { createNotification } = require('../services/notificationService');

const generateMockTransactionId = () => `mock_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

// @desc    Get PayPal Client Configuration for frontend
// @route   GET /api/payments/paypal/config
// @access  Public / Optional Auth
exports.getPayPalConfig = async (req, res) => {
    try {
        const clientId = process.env.PAYPAL_CLIENT_ID || '';
        if (!clientId) {
            return res.status(500).json({
                status: 'error',
                message: 'PayPal Client ID is not configured on the server.'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                clientId,
                currency: 'USD'
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Create PayPal Order via PayPal v2 Checkout API
// @route   POST /api/payments/paypal/create-order
// @access  Private
exports.createPayPalOrder = async (req, res) => {
    try {
        const { shippingAddress, productId, quantity = 1 } = req.body;

        let itemsToValidate;
        if (productId) {
            // Direct Product Express Checkout ("Buy Now")
            itemsToValidate = [{ product: productId, quantity: Math.max(1, Number(quantity) || 1) }];
        } else {
            // Standard Cart Checkout
            const cart = await Cart.findOne({ user: req.user._id });
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ status: 'fail', message: 'Cart is empty' });
            }
            itemsToValidate = cart.items;
        }

        const isDirectCheckout = Boolean(productId);
        // Validate stock and compute totals server-side
        const { orderItems, financials } = await buildAndValidateOrderItems(itemsToValidate, { isDirectCheckout });

        // Call PayPal v2 Orders API
        const paypalOrder = await paypalService.createPayPalOrder({
            items: orderItems,
            financials,
            shippingAddress,
            customId: req.user._id
        });

        res.status(200).json({
            status: 'success',
            data: {
                orderId: paypalOrder.id,
                status: paypalOrder.status,
                financials
            }
        });
    } catch (error) {
        console.error('PayPal create order error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to initialize PayPal order'
        });
    }
};

// @desc    Capture PayPal Order and finalize pet care purchase
// @route   POST /api/payments/paypal/capture-order
// @access  Private
exports.capturePayPalOrder = async (req, res) => {
    try {
        const { orderId, shippingAddress, billingAddress, productId, quantity = 1 } = req.body;

        if (!orderId) {
            return res.status(400).json({ status: 'fail', message: 'PayPal Order ID is required' });
        }

        // 1. Idempotency check: see if order was already recorded for this PayPal Order ID
        const existingOrderByOrderId = await Order.findOne({ 'payment.transactionId': orderId });
        if (existingOrderByOrderId) {
            return res.status(200).json({
                status: 'success',
                message: 'Order was already created for this payment',
                data: { order: existingOrderByOrderId }
            });
        }

        // 2. Pre-capture cart & inventory validation (prevent charging if out of stock or empty)
        let itemsToValidate;
        let cart = null;
        if (productId) {
            // Direct Product Express Checkout
            itemsToValidate = [{ product: productId, quantity: Math.max(1, Number(quantity) || 1) }];
        } else {
            cart = await Cart.findOne({ user: req.user._id });
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ status: 'fail', message: 'Cart is empty. Please add items to your cart before completing checkout.' });
            }
            itemsToValidate = cart.items;
        }

        const isDirectCheckout = Boolean(productId);
        const { orderItems, financials } = await buildAndValidateOrderItems(itemsToValidate, { isDirectCheckout });

        // 3. Capture payment through PayPal API
        const captureResult = await paypalService.capturePayPalOrder(orderId);

        if (captureResult.status !== 'COMPLETED' && captureResult.captureStatus !== 'COMPLETED') {
            return res.status(400).json({
                status: 'fail',
                message: `Payment capture incomplete. PayPal status: ${captureResult.status || captureResult.captureStatus}`
            });
        }

        const transactionId = captureResult.captureId || captureResult.orderId;

        // 4. Duplicate check against capture transaction ID
        const duplicate = await Order.findOne({ 'payment.transactionId': transactionId });
        if (duplicate) {
            return res.status(200).json({
                status: 'success',
                message: 'Order was already created for this payment',
                data: { order: duplicate }
            });
        }

        // 5. Determine shipping address (from body or fallback to PayPal shipping details)
        let addr = shippingAddress;
        if (!addr || !addr.firstName || !addr.lastName || !addr.address || !addr.city || !addr.postalCode || !addr.country) {
            if (captureResult.shipping?.address) {
                const paypalAddr = captureResult.shipping.address;
                const nameParts = (captureResult.shipping.name?.full_name || '').trim().split(/\s+/);
                addr = {
                    firstName: nameParts[0] || 'Valued',
                    lastName: nameParts.slice(1).join(' ') || 'Customer',
                    address: paypalAddr.address_line_1 || paypalAddr.address_line_2 || '123 Main St',
                    city: paypalAddr.admin_area_2 || 'San Jose',
                    state: paypalAddr.admin_area_1 || 'CA',
                    postalCode: paypalAddr.postal_code || '95131',
                    country: paypalAddr.country_code === 'US' ? 'United States' : (paypalAddr.country_code || 'United States')
                };
            } else {
                return res.status(400).json({ status: 'fail', message: 'Complete shipping address is required' });
            }
        }

        // 6. Create Order (store PayPal orderId as transactionId so duplicate replay by orderId matches)
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress: addr,
            billingAddress: billingAddress || addr,
            subtotal: financials.subtotal,
            tax: financials.tax,
            shippingFee: financials.shippingFee,
            total: financials.total,
            payment: {
                provider: 'paypal',
                transactionId: orderId,
                status: 'paid',
                paidAt: new Date(captureResult.updateTime || Date.now())
            },
            paymentMethod: 'paypal',
            orderStatus: 'processing',
            isPaid: true,
            paidAt: new Date(captureResult.updateTime || Date.now())
        });

        // 7. Create Payment record linking Order
        const paymentRecord = await Payment.create({
            order: order._id,
            user: req.user._id,
            paymentMethod: 'PayPal',
            paymentResult: {
                id: transactionId,
                orderId: orderId,
                status: captureResult.status || 'Completed',
                update_time: captureResult.updateTime,
                email_address: captureResult.payerEmail
            },
            amount: Number(captureResult.amount) || financials.total,
            status: 'Completed'
        });

        // 8. Decrement inventory
        await decrementProductInventory(orderItems);

        // 9. Clear user cart if cart checkout, or remove direct product from cart if present
        if (cart) {
            cart.items = [];
            await cart.save();
        } else if (productId) {
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { items: { product: productId } } }
            );
        }

        // 10. Send notifications to customer & suppliers
        await createNotification({
            user: req.user._id,
            title: '✅ PayPal Payment Received',
            message: `Your payment of $${financials.total.toFixed(2)} was completed via PayPal. Your order is now being processed.`,
            type: 'Order'
        });

        const supplierIds = [...new Set(orderItems.map(item => item.supplier?.toString()).filter(Boolean))];
        for (const supplierId of supplierIds) {
            await createNotification({
                user: supplierId,
                title: '📦 New order received (PayPal)',
                message: 'A new customer order has been placed via PayPal and requires fulfillment.',
                type: 'Order'
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'PayPal payment captured and order placed successfully',
            data: {
                order,
                payment: paymentRecord
            }
        });
    } catch (error) {
        console.error('PayPal capture order error:', error.message);
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// @desc    Create a mock payment intent (validates cart + returns intent)
// @route   POST /api/payments/intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ status: 'fail', message: 'Cart is empty' });
        }

        // Validate stock and compute totals
        const { financials } = await buildAndValidateOrderItems(cart.items);
        const intentId = generateMockTransactionId();

        res.status(200).json({
            status: 'success',
            data: {
                intentId,
                amount: financials.total,
                subtotal: financials.subtotal,
                tax: financials.tax,
                shippingFee: financials.shippingFee,
                currency: 'usd'
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Mock payment confirmation (simulates Stripe/offline confirm)
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
                status: 'paid',
                paymentStatus: 'paid',
                provider: 'mock',
                paidAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
