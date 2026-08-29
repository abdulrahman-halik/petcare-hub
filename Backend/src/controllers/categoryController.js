const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        // Calculate product count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const productCount = await Product.countDocuments({ category: cat._id, status: 'active' });
                return {
                    ...cat.toObject(),
                    productCount
                };
            })
        );

        res.status(200).json({
            status: 'success',
            count: categoriesWithCount.length,
            data: {
                categories: categoriesWithCount
            }
        });
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get single category by ID or Slug
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        let category;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category.findById(id);
        } else {
            category = await Category.findOne({ slug: id });
        }

        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Category not found' });
        }

        const productCount = await Product.countDocuments({ category: category._id, status: 'active' });

        res.status(200).json({
            status: 'success',
            data: {
                category: {
                    ...category.toObject(),
                    productCount
                }
            }
        });
    } catch (error) {
        console.error('Get Category Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin only)
exports.createCategory = async (req, res) => {
    try {
        const { name, description, image, icon, isActive } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ status: 'fail', message: 'Category name is required' });
        }

        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
        });

        if (existingCategory) {
            return res.status(400).json({ status: 'fail', message: 'A category with this name already exists' });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description || '',
            image: image || '',
            icon: icon || 'Package',
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({
            status: 'success',
            message: 'Category created successfully',
            data: { category }
        });
    } catch (error) {
        console.error('Create Category Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, image, icon, isActive } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Category not found' });
        }

        if (name && name.trim() !== category.name) {
            const existing = await Category.findOne({
                _id: { $ne: category._id },
                name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
            });
            if (existing) {
                return res.status(400).json({ status: 'fail', message: 'Another category with this name already exists' });
            }
            category.name = name.trim();
        }

        if (description !== undefined) category.description = description;
        if (image !== undefined) category.image = image;
        if (icon !== undefined) category.icon = icon;
        if (isActive !== undefined) category.isActive = isActive;

        const updatedCategory = await category.save();

        res.status(200).json({
            status: 'success',
            message: 'Category updated successfully',
            data: { category: updatedCategory }
        });
    } catch (error) {
        console.error('Update Category Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Category not found' });
        }

        // Check if any products are using this category
        const associatedProductsCount = await Product.countDocuments({ category: category._id });
        if (associatedProductsCount > 0) {
            return res.status(400).json({
                status: 'fail',
                message: `Cannot delete category. There are ${associatedProductsCount} product(s) linked to this category. Reassign or delete them first.`
            });
        }

        await category.deleteOne();

        res.status(200).json({
            status: 'success',
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete Category Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
