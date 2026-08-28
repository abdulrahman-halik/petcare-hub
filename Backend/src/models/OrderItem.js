const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('OrderItem', orderItemSchema);
