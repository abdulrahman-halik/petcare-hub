const Product = require('../models/Product');

/**
 * Validates stock availability and creates order items snapshot from active DB products
 */
exports.buildAndValidateOrderItems = async (cartItems, options = {}) => {
    const { isDirectCheckout = false } = options;
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cartItems) {
        const product = await Product.findById(cartItem.product);
        if (!product || product.status !== 'active') {
            throw new Error(`Product "${product?.name || cartItem.name || 'Item'}" is no longer available`);
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
    // For 1-click direct product express checkout ("Buy Now"),
    // amount matches exact unitPrice * quantity without unexpected shipping or tax surcharges
    const TAX_RATE = isDirectCheckout ? 0 : 0.10;
    const tax = isDirectCheckout ? 0 : Math.round(subtotal * TAX_RATE * 100) / 100;
    const shippingFee = isDirectCheckout ? 0 : (subtotal >= 50 ? 0 : 5);
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
