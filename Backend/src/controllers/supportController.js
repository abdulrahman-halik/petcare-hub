const SupportTicket = require('../models/SupportTicket');
const { createNotification } = require('../services/notificationService');

// Helper to generate a memorable, unique ticket reference ID
const generateTicketNumber = () => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `TKT-${randomHex}-${randomDigits}`;
};

// Category-based automated concierge initial tip
const getConciergeWelcome = (category, petName) => {
    switch (category) {
        case 'order_inquiry':
            return `Hello! We have received your order inquiry. Our fulfillment team is checking the tracking and logistics status. Please allow up to 1-2 hours for updates.`;
        case 'product_question':
            return `Thank you for reaching out about our pet products! If you need feeding guidelines or ingredient safety checks for ${petName || 'your pet'}, our vet specialists are on it.`;
        case 'veterinary_advice':
            return `We have received your pet care consultation request. For critical medical emergencies, please visit your local 24/7 veterinary clinic immediately. Otherwise, our certified pet wellness advisors will respond shortly.`;
        case 'billing_payment':
            return `Your billing/payment question has been routed to our accounts desk. All PayPal and card transactions are verified with banking-grade security.`;
        case 'b2b_supplier':
            return `Greetings from PetCare Hub Commercial Partnerships! Our supplier onboarding team has received your details and will assign a dedicated representative.`;
        default:
            return `Thank you for contacting PetCare Hub Concierge. Your inquiry has been prioritized and a support specialist will reply shortly.`;
    }
};

// @desc    Create a new customer support ticket
// @route   POST /api/support/tickets
// @access  Public / Optional Auth
exports.createTicket = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            subject,
            message,
            category = 'general',
            priority = 'medium',
            orderNumber,
            petName
        } = req.body;

        const effectiveName = (name || req.user?.name || '').trim();
        const effectiveEmail = (email || req.user?.email || '').trim().toLowerCase();

        if (!effectiveName) {
            return res.status(400).json({ status: 'fail', message: 'Name is required' });
        }
        if (!effectiveEmail || !effectiveEmail.includes('@')) {
            return res.status(400).json({ status: 'fail', message: 'A valid email address is required' });
        }
        if (!subject || !subject.trim()) {
            return res.status(400).json({ status: 'fail', message: 'Subject is required' });
        }
        if (!message || !message.trim()) {
            return res.status(400).json({ status: 'fail', message: 'Message content is required' });
        }

        let ticketNumber = generateTicketNumber();
        // Guard against rare collision
        let existing = await SupportTicket.findOne({ ticketNumber });
        while (existing) {
            ticketNumber = generateTicketNumber();
            existing = await SupportTicket.findOne({ ticketNumber });
        }

        const initialMessages = [
            {
                sender: 'customer',
                senderName: effectiveName,
                message: message.trim(),
                createdAt: new Date()
            },
            {
                sender: 'system',
                senderName: 'PetCare Concierge Bot',
                message: getConciergeWelcome(category, petName),
                createdAt: new Date(Date.now() + 500)
            }
        ];

        const ticket = await SupportTicket.create({
            ticketNumber,
            user: req.user ? req.user._id : null,
            name: effectiveName,
            email: effectiveEmail,
            phone: (phone || '').trim(),
            subject: subject.trim(),
            category,
            priority,
            status: 'open',
            orderNumber: (orderNumber || '').trim(),
            petName: (petName || '').trim(),
            messages: initialMessages
        });

        // Trigger user in-app notification if authenticated
        if (req.user) {
            await createNotification({
                user: req.user._id,
                title: `🎫 Support Ticket Created (#${ticketNumber})`,
                message: `We received your inquiry: "${subject.trim()}". You can track replies live.`,
                type: 'System'
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Support ticket successfully registered',
            data: { ticket }
        });
    } catch (error) {
        console.error('Error creating support ticket:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get tickets for current authenticated customer
// @route   GET /api/support/my-tickets
// @access  Private (Customer / Authenticated)
exports.getMyTickets = async (req, res) => {
    try {
        const query = {
            $or: [
                { user: req.user._id },
                { email: req.user.email.toLowerCase() }
            ]
        };

        const tickets = await SupportTicket.find(query)
            .sort({ updatedAt: -1 });

        res.status(200).json({
            status: 'success',
            count: tickets.length,
            data: { tickets }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Track ticket by ticket number (or mongo ID)
// @route   GET /api/support/track/:ticketNumber
// @access  Public / Optional Auth
exports.getTicketByNumber = async (req, res) => {
    try {
        const { ticketNumber } = req.params;
        if (!ticketNumber) {
            return res.status(400).json({ status: 'fail', message: 'Ticket reference number is required' });
        }

        const normalizedNumber = ticketNumber.trim().toUpperCase();

        const ticket = await SupportTicket.findOne({
            $or: [
                { ticketNumber: normalizedNumber },
                ...(ticketNumber.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: ticketNumber }] : [])
            ]
        });

        if (!ticket) {
            return res.status(404).json({
                status: 'fail',
                message: `No support ticket found with reference "${ticketNumber}"`
            });
        }

        res.status(200).json({
            status: 'success',
            data: { ticket }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Add reply message to an existing ticket
// @route   POST /api/support/tickets/:ticketNumber/messages
// @access  Public / Optional Auth
exports.addMessage = async (req, res) => {
    try {
        const { ticketNumber } = req.params;
        const { message, senderName } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ status: 'fail', message: 'Message content cannot be blank' });
        }

        const normalizedNumber = ticketNumber.trim().toUpperCase();
        const ticket = await SupportTicket.findOne({
            $or: [
                { ticketNumber: normalizedNumber },
                ...(ticketNumber.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: ticketNumber }] : [])
            ]
        });

        if (!ticket) {
            return res.status(404).json({ status: 'fail', message: 'Support ticket not found' });
        }

        const isAdmin = req.user && req.user.role === 'admin';
        const sender = isAdmin ? 'support' : 'customer';
        const effectiveSenderName = (senderName || (req.user ? req.user.name : ticket.name) || 'Customer').trim();

        ticket.messages.push({
            sender,
            senderName: isAdmin ? `Support Staff (${effectiveSenderName})` : effectiveSenderName,
            message: message.trim(),
            createdAt: new Date()
        });

        // Update ticket status dynamically based on who replied
        if (isAdmin) {
            ticket.status = 'in_progress';
            // If user has an account, notify them of response
            if (ticket.user) {
                await createNotification({
                    user: ticket.user,
                    title: `💬 New Reply on Ticket #${ticket.ticketNumber}`,
                    message: `Our support team has replied to your inquiry: "${ticket.subject}"`,
                    type: 'System'
                });
            }
        } else {
            // Customer replied
            if (ticket.status === 'resolved' || ticket.status === 'closed') {
                ticket.status = 'open'; // reopen if customer replies
            }
        }

        await ticket.save();

        res.status(200).json({
            status: 'success',
            message: 'Message added successfully',
            data: { ticket }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Admin: Get all support tickets with filters & pagination
// @route   GET /api/support/admin/tickets
// @access  Private / Admin
exports.getAllTicketsAdmin = async (req, res) => {
    try {
        const { status, category, priority, search, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status && status !== 'all') filter.status = status;
        if (category && category !== 'all') filter.category = category;
        if (priority && priority !== 'all') filter.priority = priority;

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            filter.$or = [
                { ticketNumber: regex },
                { subject: regex },
                { name: regex },
                { email: regex },
                { orderNumber: regex }
            ];
        }

        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const skip = (pageNum - 1) * limitNum;

        const [tickets, totalCount] = await Promise.all([
            SupportTicket.find(filter)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limitNum),
            SupportTicket.countDocuments(filter)
        ]);

        res.status(200).json({
            status: 'success',
            count: tickets.length,
            pagination: {
                totalTickets: totalCount,
                currentPage: pageNum,
                totalPages: Math.ceil(totalCount / limitNum) || 1
            },
            data: { tickets }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Admin: Update status or priority of a support ticket
// @route   PATCH /api/support/admin/tickets/:ticketNumber
// @access  Private / Admin
exports.updateTicketStatusAdmin = async (req, res) => {
    try {
        const { ticketNumber } = req.params;
        const { status, priority, adminNote } = req.body;

        const normalizedNumber = ticketNumber.trim().toUpperCase();
        const ticket = await SupportTicket.findOne({
            $or: [
                { ticketNumber: normalizedNumber },
                ...(ticketNumber.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: ticketNumber }] : [])
            ]
        });

        if (!ticket) {
            return res.status(404).json({ status: 'fail', message: 'Support ticket not found' });
        }

        if (status && ['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
            ticket.status = status;
        }

        if (priority && ['low', 'medium', 'high', 'urgent'].includes(priority)) {
            ticket.priority = priority;
        }

        if (adminNote && adminNote.trim()) {
            ticket.messages.push({
                sender: 'support',
                senderName: `Support Admin (${req.user?.name || 'Administrator'})`,
                message: adminNote.trim(),
                createdAt: new Date()
            });
        }

        await ticket.save();

        if (ticket.user && (status === 'resolved' || status === 'closed')) {
            await createNotification({
                user: ticket.user,
                title: `✅ Ticket #${ticket.ticketNumber} Marked as ${status.toUpperCase()}`,
                message: `Your support inquiry "${ticket.subject}" has been marked as ${status}. Feel free to reply if you need further help.`,
                type: 'System'
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Ticket updated successfully`,
            data: { ticket }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
