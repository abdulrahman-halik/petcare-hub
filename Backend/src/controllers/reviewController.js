const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid product ID' });
        }

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(r => { distribution[r.rating] = (distribution[r.rating] || 0) + 1; });

        res.status(200).json({
            status: 'success',
            count: reviews.length,
            data: { reviews, distribution }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Create a review (verified purchase only)
// @route   POST /api/products/:productId/reviews
// @access  Private (customer)
exports.createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid product ID' });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ status: 'fail', message: 'Rating must be between 1 and 5' });
        }
        if (!comment || comment.trim().length < 3) {
            return res.status(400).json({ status: 'fail', message: 'Comment is required (min 3 characters)' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ status: 'fail', message: 'Product not found' });

        // Check for verified purchase: user must have a paid order containing this product
        const paidOrder = await Order.findOne({
            user: req.user._id,
            'items.product': productId,
            'payment.status': 'paid'
        });

        if (!paidOrder) {
            return res.status(403).json({
                status: 'fail',
                message: 'You can only review products from completed orders'
            });
        }

        // Prevent duplicate review
        const existing = await Review.findOne({ user: req.user._id, product: productId });
        if (existing) {
            return res.status(409).json({ status: 'fail', message: 'You have already reviewed this product' });
        }

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            order: paidOrder._id,
            name: req.user.name,
            rating: Number(rating),
            comment: comment.trim().substring(0, 1000)
        });

        // Update product average rating
        const allReviews = await Review.find({ product: productId });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(avgRating * 10) / 10,
            numReviews: allReviews.length
        });

        res.status(201).json({ status: 'success', data: { review } });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ status: 'fail', message: 'You have already reviewed this product' });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update own review
// @route   PUT /api/reviews/:reviewId
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ status: 'fail', message: 'Review not found' });
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ status: 'fail', message: 'Not authorized to edit this review' });
        }

        if (rating) review.rating = Number(rating);
        if (comment) review.comment = comment.trim().substring(0, 1000);
        await review.save();

        // Recalculate average
        const allReviews = await Review.find({ product: review.product });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await Product.findByIdAndUpdate(review.product, {
            rating: Math.round(avgRating * 10) / 10
        });

        res.status(200).json({ status: 'success', data: { review } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Delete own review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ status: 'fail', message: 'Review not found' });
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'Not authorized' });
        }

        const productId = review.product;
        await review.deleteOne();

        // Recalculate average
        const remaining = await Review.find({ product: productId });
        const avgRating = remaining.length > 0
            ? remaining.reduce((acc, r) => acc + r.rating, 0) / remaining.length
            : 0;
        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(avgRating * 10) / 10,
            numReviews: remaining.length
        });

        res.status(200).json({ status: 'success', message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
