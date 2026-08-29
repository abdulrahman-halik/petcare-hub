const Notification = require('../models/Notification');

const createNotification = async ({ user, title, message, type = 'System' }) => {
    if (!user || !title || !message) return null;

    return Notification.create({
        user,
        title,
        message,
        type,
        isRead: false
    });
};

module.exports = {
    createNotification
};
