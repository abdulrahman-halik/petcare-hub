const Product = require('../models/Product');

/**
 * Validates stock availability and creates order items snapshot from active DB products
 */
exports.buildAndValidateOrderItems = async (cartItems) => {
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cartItems) {
        const product = await Product.findById(cartItem.product);
        if (!product || product.status !== 'active') {
            throw new Error(`Product "${cartItem.name}" is no longer available`);
        }
        if (product.stock < cartItem.quantity) {
            throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
        }

        const unitPrice = product.price;
        const itemSubtotal = Math.round(unitPrice * cartItem.quantity * 100) / 100;
        subtotal += itemSubtotal;

        orderItems.push({
            product: product._id,
            name: product.name,
            imageUrl: product.imageUrl || '',
            supplier: product.supplier,
            quantity: cartItem.quantity,
            unitPrice,
            subtotal: itemSubtotal
        });
    }

    subtotal = Math.round(subtotal * 100) / 100;
    const TAX_RATE = 0.10;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const shippingFee = subtotal >= 50 ? 0 : 5;
    const total = Math.round((subtotal + tax + shippingFee) * 100) / 100;

    return {
        orderItems,
        financials: { subtotal, tax, shippingFee, total }
    };
};

/**
 * Decrements product stock inventory atomically
 */
exports.decrementProductInventory = async (orderItems) => {
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
        });
    }
};
