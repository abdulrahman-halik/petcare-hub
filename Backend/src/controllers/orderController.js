const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { createNotification } = require('../services/notificationService');

// @desc    Create order after successful payment
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, billingAddress, payment } = req.body;

        // Validate required fields
        const addr = shippingAddress;
        if (!addr || !addr.firstName || !addr.lastName || !addr.address || !addr.city || !addr.postalCode || !addr.country) {
            return res.status(400).json({ status: 'fail', message: 'Complete shipping address is required' });
        }
        if (!payment || !payment.transactionId || payment.status !== 'paid') {
            return res.status(400).json({ status: 'fail', message: 'Valid payment confirmation is required' });
        }

        // Prevent duplicate orders for same transaction
        const duplicate = await Order.findOne({ 'payment.transactionId': payment.transactionId });
        if (duplicate) {
            return res.status(409).json({ status: 'fail', message: 'Order already created for this payment' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ status: 'fail', message: 'Cart is empty' });
        }

        // Build order items with server-side price snapshots + validate stock atomically
        const orderItems = [];
        let subtotal = 0;

        for (const cartItem of cart.items) {
            const product = await Product.findById(cartItem.product);
            if (!product || product.status !== 'active') {
                return res.status(400).json({ status: 'fail', message: `Product "${cartItem.name}" is no longer available` });
            }
            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Insufficient stock for "${product.name}". Available: ${product.stock}`
                });
            }

            const unitPrice = product.price; // always use DB price
            const itemSubtotal = Math.round(unitPrice * cartItem.quantity * 100) / 100;
            subtotal += itemSubtotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                imageUrl: product.imageUrl || '',
                supplier: product.supplier,
                quantity: cartItem.quantity,
                unitPrice,
                subtotal: itemSubtotal
            });
        }

        subtotal = Math.round(subtotal * 100) / 100;
        const TAX_RATE = 0.10;
        const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
        const shippingFee = subtotal >= 50 ? 0 : 5;
        const total = Math.round((subtotal + tax + shippingFee) * 100) / 100;

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress: addr,
            billingAddress: billingAddress || addr,
            subtotal,
            tax,
            shippingFee,
            total,
            payment: {
                provider: payment.provider || 'mock',
                transactionId: payment.transactionId,
                status: 'paid',
                paidAt: new Date()
            },
            orderStatus: 'processing',
            isPaid: true,
            paidAt: new Date()
        });

        // Reduce inventory atomically (use $inc to prevent race conditions)
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        await createNotification({
            user: req.user._id,
            title: '✅ Order confirmed',
            message: `Your order has been placed successfully. Tracking will be shared as soon as it ships.`,
            type: 'Order'
        });

        const supplierIds = [...new Set(orderItems.map(item => item.supplier?.toString()).filter(Boolean))];
        for (const supplierId of supplierIds) {
            await createNotification({
                user: supplierId,
                title: '📦 New order received',
                message: 'A new customer order has been placed and requires fulfillment.',
                type: 'Order'
            });
        }

        res.status(201).json({ status: 'success', data: { order } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get current user's orders
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select('_id items subtotal tax shippingFee total payment orderStatus createdAt');

        res.status(200).json({ status: 'success', count: orders.length, data: { orders } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get single order by ID (owner only)
// @route   GET /api/orders/:orderId
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid order ID' });
        }

        const order = await Order.findById(orderId)
            .populate('items.product', 'name imageUrl')
            .populate('items.supplier', 'name');

        if (!order) return res.status(404).json({ status: 'fail', message: 'Order not found' });

        // Ensure customers only see their own orders
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'Not authorized to view this order' });
        }

        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', count: orders.length, data: { orders } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get supplier orders for fulfillment dashboard
// @route   GET /api/orders/supplier/my-orders
// @access  Private (Supplier, Admin)
exports.getSupplierOrders = async (req, res) => {
    try {
        const query = { 'items.supplier': req.user._id };
        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', count: orders.length, data: { orders } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update order status and notify customer when order is shipped/delivered
// @route   PATCH /api/orders/:orderId/status
// @access  Private (Admin, Supplier)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'fail',
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ status: 'fail', message: 'Order not found' });
        }

        if (req.user.role !== 'admin') {
            const supplierMatch = order.items.some(item => item.supplier && item.supplier.toString() === req.user._id.toString());
            if (!supplierMatch) {
                return res.status(403).json({ status: 'fail', message: 'Not authorized to update this order' });
            }
        }

        order.orderStatus = status;
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }

        await order.save();

        const statusMessageMap = {
            processing: 'Your order is now being processed and prepared for shipment.',
            shipped: 'Your order has shipped and is on its way to you.',
            delivered: 'Your order has been delivered successfully. We hope your pet loves it!',
            cancelled: 'Your order has been cancelled. Please contact support if you need assistance.'
        };

        const message = statusMessageMap[status] || 'Your order status has been updated.';
        await createNotification({
            user: order.user,
            title: `📦 Order Update: ${status}`,
            message,
            type: 'Order'
        });

        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
