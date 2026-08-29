const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner reference is required']
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: [true, 'Pet reference is required']
    },
    title: {
        type: String,
        required: [true, 'Reminder title is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['vaccination', 'grooming', 'medication', 'vet-visit', 'diet', 'other'],
        default: 'other'
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    time: {
        type: String,
        default: '09:00 AM'
    },
    frequency: {
        type: String,
        enum: ['once', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
        default: 'once'
    },
    notes: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'overdue', 'dismissed'],
        default: 'pending'
    },
    isAutomated: {
        type: Boolean,
        default: false
    },
    notified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
