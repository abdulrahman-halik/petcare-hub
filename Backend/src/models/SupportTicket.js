const mongoose = require('mongoose');

const messageSubSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['customer', 'support', 'system'],
        default: 'customer'
    },
    senderName: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const supportTicketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    name: {
        type: String,
        required: [true, 'Please provide your full name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide a valid email address'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    subject: {
        type: String,
        required: [true, 'Please enter a ticket subject'],
        trim: true
    },
    category: {
        type: String,
        enum: [
            'general',
            'order_inquiry',
            'product_question',
            'veterinary_advice',
            'billing_payment',
            'b2b_supplier',
            'social_events',
            'entrepreneur_partner',
            'feedback'
        ],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'closed'],
        default: 'open'
    },
    orderNumber: {
        type: String,
        trim: true,
        default: ''
    },
    petName: {
        type: String,
        trim: true,
        default: ''
    },
    messages: [messageSubSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
