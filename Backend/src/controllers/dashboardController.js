const mongoose = require('mongoose');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Reminder = require('../models/Reminder');
const Notification = require('../models/Notification');

const getCustomerDashboard = async (req, res) => {
    try {
        const [petCount, reminderCount, recentOrders, recommendations, unreadNotifications] = await Promise.all([
            Pet.countDocuments({ owner: req.user._id }),
            Reminder.countDocuments({ owner: req.user._id, status: { $in: ['pending', 'overdue'] } }),
            Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5).lean(),
            Product.find({ status: 'active' }).sort({ rating: -1, numReviews: -1 }).limit(4).lean(),
            Notification.countDocuments({ user: req.user._id, isRead: false })
        ]);

        const stats = {
            petCount,
            activeReminders: reminderCount,
            recentOrders: recentOrders.length,
            recommendedProducts: recommendations.length,
            unreadNotifications
        };

        return res.status(200).json({
            status: 'success',
            data: {
                user: {
                    _id: req.user._id,
                    name: req.user.name,
                    role: req.user.role
                },
                stats,
                recentOrders,
                recommendations
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to load customer dashboard'
        });
    }
};

const getSupplierDashboard = async (req, res) => {
    try {
        const supplierId = req.user._id;

        const [productCount, lowStockProducts, supplierOrders, totalRevenue, activeOrders] = await Promise.all([
            Product.countDocuments({ supplier: supplierId }),
            Product.countDocuments({ supplier: supplierId, stock: { $lte: 5 }, status: 'active' }),
            Order.find({ 'items.supplier': supplierId }).sort({ createdAt: -1 }).limit(8).lean(),
            Order.aggregate([
                { $match: { 'items.supplier': new mongoose.Types.ObjectId(supplierId) } },
                { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
            ]),
            Order.countDocuments({ 'items.supplier': supplierId, orderStatus: { $in: ['pending', 'processing', 'shipped'] } })
        ]);

        const revenue = totalRevenue[0]?.totalRevenue || 0;
        const recentProducts = await Product.find({ supplier: supplierId }).sort({ createdAt: -1 }).limit(5).lean();

        return res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalProducts: productCount,
                    lowStockProducts,
                    activeOrders,
                    totalRevenue: Number(revenue.toFixed(2))
                },
                recentOrders: supplierOrders,
                recentProducts
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to load supplier dashboard'
        });
    }
};

const getAdminDashboard = async (req, res) => {
    try {
        const [totalSales, orderCount, customerCount, supplierCount, productCount, topRatedProducts, recentOrders, flaggedProducts] = await Promise.all([
            Order.aggregate([
                { $group: { _id: null, totalRevenue: { $sum: '$total' }, totalOrders: { $sum: 1 } } }
            ]),
            Order.countDocuments(),
            User.countDocuments({ role: 'customer' }),
            User.countDocuments({ role: 'supplier' }),
            Product.countDocuments(),
            Product.find({ status: 'active' }).sort({ rating: -1, numReviews: -1 }).limit(5).lean(),
            Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(8).lean(),
            Product.countDocuments({ status: 'flagged' })
        ]);

        const summary = totalSales[0] || { totalRevenue: 0, totalOrders: 0 };

        return res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalSales: Number(summary.totalRevenue?.toFixed(2) || 0),
                    totalOrders: summary.totalOrders || orderCount,
                    totalCustomers: customerCount,
                    totalSuppliers: supplierCount,
                    totalProducts: productCount,
                    flaggedProducts,
                    activeProducts: await Product.countDocuments({ status: 'active' })
                },
                topRatedProducts,
                recentOrders
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to load admin dashboard'
        });
    }
};

const getDashboardOverview = async (req, res) => {
    try {
        if (req.user.role === 'customer') return getCustomerDashboard(req, res);
        if (req.user.role === 'supplier') return getSupplierDashboard(req, res);
        if (req.user.role === 'admin') return getAdminDashboard(req, res);

        return res.status(403).json({
            status: 'fail',
            message: 'Role dashboard is not available for this account type'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to load dashboard'
        });
    }
};

module.exports = {
    getCustomerDashboard,
    getSupplierDashboard,
    getAdminDashboard,
    getDashboardOverview
};
