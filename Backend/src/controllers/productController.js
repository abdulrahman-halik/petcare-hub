const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

// @desc    Get all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const {
            keyword,
            category,
            petType,
            minPrice,
            maxPrice,
            inStock,
            supplier,
            sort,
            status,
            page = 1,
            limit = 12
        } = req.query;

        const query = {};

        // Status filter: Public only sees 'active' unless admin/supplier queries
        if (status && (req.user?.role === 'admin' || req.user?.role === 'supplier')) {
            query.status = status;
        } else {
            query.status = 'active';
        }

        // Keyword Search
        if (keyword && keyword.trim() !== '') {
            const regex = new RegExp(keyword.trim(), 'i');
            query.$or = [
                { name: regex },
                { description: regex },
                { brand: regex },
                { features: regex }
            ];
        }

        // Category Filter (support ID or Slug)
        if (category && category !== 'all') {
            if (category.match(/^[0-9a-fA-F]{24}$/)) {
                query.category = category;
            } else {
                const foundCategory = await Category.findOne({ slug: category });
                if (foundCategory) {
                    query.category = foundCategory._id;
                }
            }
        }

        // Pet Type Filter
        if (petType && petType !== 'all') {
            query.petType = { $in: [petType, 'all'] };
        }

        // Price Filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined && minPrice !== '') {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice !== undefined && maxPrice !== '') {
                query.price.$lte = Number(maxPrice);
            }
        }

        // In Stock Filter
        if (inStock === 'true' || inStock === true) {
            query.stock = { $gt: 0 };
        }

        // Supplier Filter
        if (supplier) {
            query.supplier = supplier;
        }

        // Sorting
        let sortOption = { createdAt: -1 }; // default newest
        if (sort === 'price_asc') sortOption = { price: 1 };
        else if (sort === 'price_desc') sortOption = { price: -1 };
        else if (sort === 'rating') sortOption = { rating: -1, numReviews: -1 };
        else if (sort === 'popular') sortOption = { numReviews: -1, rating: -1 };
        else if (sort === 'newest') sortOption = { createdAt: -1 };

        // Pagination
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
            data: {
                topRated,
                newArrivals
            }
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
            .populate('supplier', 'name email role createdAt');

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        // Fetch reviews for this product
        const reviews = await Review.find({ product: id })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        // Fetch related products in the same category
        const relatedProducts = await Product.find({
            category: product.category._id,
            _id: { $ne: product._id },
            status: 'active'
        })
            .populate('category', 'name slug')
            .populate('supplier', 'name')
            .limit(4);

        res.status(200).json({
            status: 'success',
            data: {
                product,
                reviews,
                relatedProducts
            }
        });
    } catch (error) {
        console.error('Get Product Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get products for the logged-in supplier
// @route   GET /api/products/supplier/my-products
// @access  Private (Supplier, Admin)
exports.getMyProducts = async (req, res) => {
    try {
        const supplierId = req.user._id;

        const query = req.user.role === 'admin' && req.query.supplierId 
            ? { supplier: req.query.supplierId } 
            : { supplier: supplierId };

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });

        // Compute supplier inventory stats
        const totalListings = products.length;
        const activeListings = products.filter(p => p.status === 'active').length;
        const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
        const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
        const outOfStockCount = products.filter(p => p.stock === 0).length;

        res.status(200).json({
            status: 'success',
            data: {
                products,
                stats: {
                    totalListings,
                    activeListings,
                    totalStock,
                    lowStockCount,
                    outOfStockCount
                }
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
        const {
            name,
            description,
            price,
            stock,
            category,
            imageUrl,
            images,
            brand,
            petType,
            features
        } = req.body;

        // Validation
        if (!name || !description || price === undefined || stock === undefined || !category) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide name, description, price, stock, and category'
            });
        }

        // Verify category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ status: 'fail', message: 'Selected category does not exist' });
        }

        // Set supplier: current user or admin override
        let supplierId = req.user._id;
        if (req.user.role === 'admin' && req.body.supplier) {
            supplierId = req.body.supplier;
        }

        const productImages = Array.isArray(images) && images.length > 0 
            ? images 
            : (imageUrl ? [imageUrl] : []);

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            stock: Number(stock),
            category,
            supplier: supplierId,
            imageUrl: productImages[0] || '',
            images: productImages,
            brand: brand ? brand.trim() : '',
            petType: petType || 'all',
            features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
            status: 'active'
        });

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

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        // Check ownership: Admin can edit any, Supplier can only edit own products
        if (req.user.role !== 'admin' && product.supplier.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'fail',
                message: 'You are not authorized to update this product listing'
            });
        }

        const {
            name,
            description,
            price,
            stock,
            category,
            imageUrl,
            images,
            brand,
            petType,
            features,
            status
        } = req.body;

        if (name !== undefined) product.name = name.trim();
        if (description !== undefined) product.description = description.trim();
        if (price !== undefined) product.price = Number(price);
        if (stock !== undefined) product.stock = Number(stock);
        if (brand !== undefined) product.brand = brand.trim();
        if (petType !== undefined) product.petType = petType;
        if (status !== undefined) product.status = status;

        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ status: 'fail', message: 'Selected category does not exist' });
            }
            product.category = category;
        }

        if (features !== undefined) {
            product.features = Array.isArray(features) 
                ? features 
                : features.split(',').map(f => f.trim()).filter(Boolean);
        }

        if (images !== undefined && Array.isArray(images)) {
            product.images = images;
            if (images.length > 0) product.imageUrl = images[0];
        } else if (imageUrl !== undefined) {
            product.imageUrl = imageUrl;
            if (!product.images || product.images.length === 0) {
                product.images = [imageUrl];
            }
        }

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

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        // Ownership check
        if (req.user.role !== 'admin' && product.supplier.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'fail',
                message: 'You are not authorized to delete this product listing'
            });
        }

        await product.deleteOne();

        res.status(200).json({
            status: 'success',
            message: 'Product listing deleted successfully'
        });
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
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

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
