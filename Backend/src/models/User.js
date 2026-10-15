const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['customer', 'supplier', 'admin'], default: 'customer' },
    accountStatus: {
        type: String,
        enum: ['active', 'deactivated'],
        default: 'active',
        index: true
    },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    address: { type: String, trim: true, maxlength: 500, default: '' },
    // These identifiers are set only for the corresponding account role.
    supplierId: { type: String, trim: true, uppercase: true, unique: true, sparse: true, maxlength: 50 },
    customerId: { type: String, trim: true, uppercase: true, unique: true, sparse: true, maxlength: 50 },
    businessName: { type: String, trim: true, maxlength: 160, default: '' },
    contactPerson: { type: String, trim: true, maxlength: 120, default: '' },
}, { timestamps: true });

// Hash password before saving (compatible with modern Mongoose async hooks)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
