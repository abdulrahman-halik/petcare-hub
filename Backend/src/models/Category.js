const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Category name is required'], 
        unique: true, 
        trim: true 
    },
    slug: { 
        type: String, 
        trim: true, 
        lowercase: true 
    },
    description: { 
        type: String, 
        default: '' 
    },
    image: { 
        type: String, 
        default: '' 
    },
    icon: { 
        type: String, 
        default: 'Package' 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

// Auto-generate slug if not provided
categorySchema.pre('save', function (next) {
    if (this.name && (!this.slug || this.isModified('name'))) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
    if (typeof next === 'function') next();
});

module.exports = mongoose.model('Category', categorySchema);
