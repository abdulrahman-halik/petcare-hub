const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const { unreadOnly, limit = 20 } = req.query;
        const query = { user: req.user._id };

        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) || 20);

        return res.status(200).json({
            status: 'success',
            count: notifications.length,
            data: { notifications }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch notifications'
        });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({
            user: req.user._id,
            isRead: false
        });

        return res.status(200).json({
            status: 'success',
            data: { unreadCount }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to count unread notifications'
        });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                status: 'fail',
                message: 'Notification not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: { notification }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to mark notification as read'
        });
    }
};

exports.markAllNotificationsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({
            status: 'success',
            message: 'All notifications marked as read',
            data: { updatedCount: result.modifiedCount || 0 }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to mark notifications as read'
        });
    }
};
