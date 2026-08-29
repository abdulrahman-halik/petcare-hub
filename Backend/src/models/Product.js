const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Product name is required'], 
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, 'Product description is required'] 
    },
    price: { 
        type: Number, 
        required: [true, 'Product price is required'], 
        min: [0, 'Price must be positive'] 
    },
    stock: { 
        type: Number, 
        required: [true, 'Stock count is required'], 
        default: 0, 
        min: [0, 'Stock cannot be negative'] 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: [true, 'Product category is required'] 
    },
    supplier: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Supplier reference is required'] 
    },
    imageUrl: { 
        type: String, 
        default: '' 
    },
    images: [{ 
        type: String 
    }],
    brand: { 
        type: String, 
        default: '' 
    },
    petType: { 
        type: String, 
        enum: ['all', 'dog', 'cat', 'bird', 'fish', 'small-pet', 'reptile'], 
        default: 'all' 
    },
    features: [{ 
        type: String 
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'flagged'],
        default: 'active'
    },
    rating: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 5 
    },
    numReviews: { 
        type: Number, 
        default: 0, 
        min: 0 
    }
}, { timestamps: true });

// Ensure imageUrl and images array sync properly
productSchema.pre('save', function (next) {
    if (this.images && this.images.length > 0 && !this.imageUrl) {
        this.imageUrl = this.images[0];
    } else if (this.imageUrl && (!this.images || this.images.length === 0)) {
        this.images = [this.imageUrl];
    }
    if (typeof next === 'function') next();
});

module.exports = mongoose.model('Product', productSchema);
