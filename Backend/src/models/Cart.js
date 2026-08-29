const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // price snapshot from DB — never trust frontend
    imageUrl: { type: String, default: '' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    subtotal: { type: Number, required: true }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
}, { timestamps: true });

// Recalculate totals before every save
cartSchema.pre('save', function () {
    const TAX_RATE = 0.10;
    const FREE_SHIPPING_THRESHOLD = 50;
    const FLAT_SHIPPING_FEE = 5;

    this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    this.subtotal = Math.round(this.subtotal * 100) / 100;
    this.tax = Math.round(this.subtotal * TAX_RATE * 100) / 100;
    this.shippingFee = this.items.length === 0 ? 0 : (this.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE);
    this.total = Math.round((this.subtotal + this.tax + this.shippingFee) * 100) / 100;
});

module.exports = mongoose.model('Cart', cartSchema);
