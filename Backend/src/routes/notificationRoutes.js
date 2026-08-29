const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead
} = require('../controllers/notificationController');

router.use(protect);
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/:id/read', markNotificationRead);
router.patch('/mark-all-read', markAllNotificationsRead);

module.exports = router;
