const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products.product', 'name price imageUrl images stock status brand category supplier rating numReviews');

        if (!wishlist) {
            return res.status(200).json({ status: 'success', data: { wishlist: { products: [] } } });
        }

        res.status(200).json({ status: 'success', data: { wishlist } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ status: 'fail', message: 'Valid product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [{ product: productId }] });
        } else {
            const alreadyIn = wishlist.products.some(p => p.product.toString() === productId);
            if (alreadyIn) {
                return res.status(409).json({ status: 'fail', message: 'Product already in wishlist' });
            }
            wishlist.products.push({ product: productId });
            await wishlist.save();
        }

        res.status(201).json({ status: 'success', message: 'Product added to wishlist', data: { wishlist } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid product ID' });
        }

        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            return res.status(404).json({ status: 'fail', message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(p => p.product.toString() !== productId);
        await wishlist.save();

        res.status(200).json({ status: 'success', message: 'Product removed from wishlist' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/:productId/check
// @access  Private
exports.checkWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        const isWishlisted = wishlist
            ? wishlist.products.some(p => p.product.toString() === productId)
            : false;

        res.status(200).json({ status: 'success', data: { isWishlisted } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
