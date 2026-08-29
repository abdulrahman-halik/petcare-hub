const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = { user: req.user._id, items: [], subtotal: 0, tax: 0, shippingFee: 0, total: 0 };
        }
        res.status(200).json({ status: 'success', data: { cart } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Add item to cart (always fetch price from DB)
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ status: 'fail', message: 'Valid product ID is required' });
        }
        if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
            return res.status(400).json({ status: 'fail', message: 'Quantity must be a positive integer' });
        }

        const product = await Product.findById(productId);
        if (!product || product.status !== 'active') {
            return res.status(404).json({ status: 'fail', message: 'Product not found or unavailable' });
        }
        if (product.stock < Number(quantity)) {
            return res.status(400).json({ status: 'fail', message: `Only ${product.stock} units available` });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingIndex = cart.items.findIndex(i => i.product.toString() === productId);

        if (existingIndex >= 0) {
            const newQty = cart.items[existingIndex].quantity + Number(quantity);
            if (newQty > product.stock) {
                return res.status(400).json({ status: 'fail', message: `Only ${product.stock} units available (${cart.items[existingIndex].quantity} already in cart)` });
            }
            cart.items[existingIndex].quantity = newQty;
            cart.items[existingIndex].subtotal = Math.round(product.price * newQty * 100) / 100;
        } else {
            cart.items.push({
                product: product._id,
                name: product.name,
                price: product.price, // always from DB
                imageUrl: product.imageUrl || (product.images && product.images[0]) || '',
                supplier: product.supplier,
                quantity: Number(quantity),
                subtotal: Math.round(product.price * Number(quantity) * 100) / 100
            });
        }

        await cart.save();
        res.status(200).json({ status: 'success', message: 'Item added to cart', data: { cart } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
            return res.status(400).json({ status: 'fail', message: 'Quantity must be a positive integer' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ status: 'fail', message: 'Product not found' });
        if (product.stock < Number(quantity)) {
            return res.status(400).json({ status: 'fail', message: `Only ${product.stock} units available` });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ status: 'fail', message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ status: 'fail', message: 'Item not in cart' });

        cart.items[itemIndex].quantity = Number(quantity);
        cart.items[itemIndex].price = product.price; // refresh price from DB
        cart.items[itemIndex].subtotal = Math.round(product.price * Number(quantity) * 100) / 100;

        await cart.save();
        res.status(200).json({ status: 'success', message: 'Cart updated', data: { cart } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ status: 'fail', message: 'Cart not found' });

        cart.items = cart.items.filter(i => i.product.toString() !== productId);
        await cart.save();
        res.status(200).json({ status: 'success', message: 'Item removed from cart', data: { cart } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.status(200).json({ status: 'success', message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
