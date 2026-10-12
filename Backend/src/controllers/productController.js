const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const {
    buildProductQuery,
    buildSortOption,
    calculateSupplierStats,
    formatProductPayload,
    applyProductUpdates
} = require('../services/productQueryService');

// @desc    Get all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const { sort, page = 1, limit = 12 } = req.query;
        const query = await buildProductQuery(req.query, req.user);
        const sortOption = buildSortOption(sort);

        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
        const skip = (pageNum - 1) * limitNum;

        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name slug icon')
            .populate('supplier', 'name email role')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            status: 'success',
            data: {
                products,
                pagination: {
                    totalProducts,
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalProducts / limitNum),
                    limit: limitNum,
                    hasMore: pageNum * limitNum < totalProducts
                }
            }
        });
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get featured and trending products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
    try {
        const topRated = await Product.find({ status: 'active' })
            .populate('category', 'name slug')
            .populate('supplier', 'name')
            .sort({ rating: -1, numReviews: -1 })
            .limit(8);

        const newArrivals = await Product.find({ status: 'active' })
            .populate('category', 'name slug')
            .populate('supplier', 'name')
            .sort({ createdAt: -1 })
            .limit(8);

        res.status(200).json({
            status: 'success',
            data: { topRated, newArrivals }
        });
    } catch (error) {
        console.error('Get Featured Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid product ID' });
        }

        const product = await Product.findById(id)
            .populate('category', 'name slug icon description')
            .populate('supplier', 'name email role');

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        const reviews = await Review.find({ product: id })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        const relatedProducts = await Product.find({
            category: product.category?._id || product.category,
            _id: { $ne: product._id },
            status: 'active'
        })
            .populate('category', 'name slug')
            .populate('supplier', 'name')
            .limit(4);

        res.status(200).json({
            status: 'success',
            data: { product, reviews, relatedProducts }
        });
    } catch (error) {
        console.error('Get Product By ID Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get products for the logged-in supplier
// @route   GET /api/products/supplier/my-products
// @access  Private (Supplier, Admin)
exports.getMyProducts = async (req, res) => {
    try {
        const query = req.user.role === 'admin' && req.query.supplierId 
            ? { supplier: req.query.supplierId } 
            : { supplier: req.user._id };

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: {
                products,
                stats: calculateSupplierStats(products)
            }
        });
    } catch (error) {
        console.error('Get My Products Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Supplier, Admin)
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        if (!name || !description || price === undefined || stock === undefined || !category) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide name, description, price, stock, and category'
            });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ status: 'fail', message: 'Selected category does not exist' });
        }

        const supplierId = (req.user.role === 'admin' && req.body.supplier) ? req.body.supplier : req.user._id;
        const payload = formatProductPayload(req.body, supplierId);
        const product = await Product.create(payload);

        const populatedProduct = await Product.findById(product._id)
            .populate('category', 'name slug')
            .populate('supplier', 'name email role');

        res.status(201).json({
            status: 'success',
            message: 'Product listing created successfully',
            data: { product: populatedProduct }
        });
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Supplier [own products], Admin)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ status: 'fail', message: 'Product not found' });

        if (req.user.role !== 'admin' && product.supplier.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'fail',
                message: 'You are not authorized to update this product listing'
            });
        }

        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(400).json({ status: 'fail', message: 'Selected category does not exist' });
            }
        }

        applyProductUpdates(product, req.body);
        const updatedProduct = await product.save();

        const populatedProduct = await Product.findById(updatedProduct._id)
            .populate('category', 'name slug')
            .populate('supplier', 'name email role');

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: { product: populatedProduct }
        });
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Supplier [own products], Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ status: 'fail', message: 'Product not found' });

        if (req.user.role !== 'admin' && product.supplier.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'fail',
                message: 'You are not authorized to delete this product listing'
            });
        }

        await product.deleteOne();
        res.status(200).json({ status: 'success', message: 'Product listing deleted successfully' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Moderate product status (flag, unflag, deactivate)
// @route   PATCH /api/products/:id/moderate
// @access  Private (Admin only)
exports.moderateProduct = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'inactive', 'flagged'].includes(status)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid status. Allowed values are: active, inactive, flagged'
            });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ status: 'fail', message: 'Product not found' });

        product.status = status;
        await product.save();

        res.status(200).json({
            status: 'success',
            message: `Product marked as ${status}`,
            data: { product }
        });
    } catch (error) {
        console.error('Moderate Product Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
