const Category = require('../models/Category');

/**
 * Service utility for building dynamic Product MongoDB filter queries
 */
exports.buildProductQuery = async (params, user) => {
    const { keyword, category, petType, minPrice, maxPrice, inStock, supplier, status } = params;
    const query = {};

    if (status && (user?.role === 'admin' || user?.role === 'supplier')) {
        query.status = status;
    } else {
        query.status = 'active';
    }

    if (keyword && keyword.trim() !== '') {
        const regex = new RegExp(keyword.trim(), 'i');
        query.$or = [{ name: regex }, { description: regex }, { brand: regex }, { features: regex }];
    }

    if (category && category !== 'all') {
        if (category.match(/^[0-9a-fA-F]{24}$/)) {
            query.category = category;
        } else {
            const foundCategory = await Category.findOne({ slug: category });
            if (foundCategory) query.category = foundCategory._id;
        }
    }

    if (petType && petType !== 'all') {
        query.petType = { $in: [petType, 'all'] };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
        if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true' || inStock === true) {
        query.stock = { $gt: 0 };
    }

    if (supplier) {
        query.supplier = supplier;
    }

    return query;
};

/**
 * Maps client sort parameters to MongoDB sort options
 */
exports.buildSortOption = (sort) => {
    switch (sort) {
        case 'price_asc': return { price: 1 };
        case 'price_desc': return { price: -1 };
        case 'rating': return { rating: -1, numReviews: -1 };
        case 'popular': return { numReviews: -1, rating: -1 };
        case 'newest':
        default: return { createdAt: -1 };
    }
};

/**
 * Calculates summary metrics for supplier inventory
 */
exports.calculateSupplierStats = (products = []) => {
    return {
        totalListings: products.length,
        activeListings: products.filter(p => p.status === 'active').length,
        totalStock: products.reduce((acc, p) => acc + (p.stock || 0), 0),
        lowStockCount: products.filter(p => p.stock > 0 && p.stock <= 5).length,
        outOfStockCount: products.filter(p => p.stock === 0).length
    };
};

/**
 * Formats and validates product create payload
 */
exports.formatProductPayload = (body, supplierId) => {
    const { name, description, price, stock, category, imageUrl, images, brand, petType, features } = body;
    const productImages = Array.isArray(images) && images.length > 0 ? images : (imageUrl ? [imageUrl] : []);

    return {
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
    };
};

/**
 * Mutates product model with sanitized partial updates
 */
exports.applyProductUpdates = (product, body) => {
    const { name, description, price, stock, category, imageUrl, images, brand, petType, features, status } = body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (brand !== undefined) product.brand = brand.trim();
    if (petType !== undefined) product.petType = petType;
    if (status !== undefined) product.status = status;
    if (category) product.category = category;

    if (features !== undefined) {
        product.features = Array.isArray(features) ? features : features.split(',').map(f => f.trim()).filter(Boolean);
    }
    if (images !== undefined && Array.isArray(images)) {
        product.images = images;
        if (images.length > 0) product.imageUrl = images[0];
    } else if (imageUrl !== undefined) {
        product.imageUrl = imageUrl;
        if (!product.images || product.images.length === 0) product.images = [imageUrl];
    }
};
