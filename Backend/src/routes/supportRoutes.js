const express = require('express');
const router = express.Router();
const {
    createTicket,
    getMyTickets,
    getTicketByNumber,
    addMessage,
    getAllTicketsAdmin,
    updateTicketStatusAdmin
} = require('../controllers/supportController');
const { protect, optionalAuth, authorize } = require('../middlewares/authMiddleware');

// Public / Guest / Customer routes
router.post('/tickets', optionalAuth, createTicket);
router.get('/my-tickets', protect, getMyTickets);
router.get('/track/:ticketNumber', optionalAuth, getTicketByNumber);
router.post('/tickets/:ticketNumber/messages', optionalAuth, addMessage);

// Admin-only routes
router.get('/admin/tickets', protect, authorize('admin'), getAllTicketsAdmin);
router.patch('/admin/tickets/:ticketNumber', protect, authorize('admin'), updateTicketStatusAdmin);

module.exports = router;
