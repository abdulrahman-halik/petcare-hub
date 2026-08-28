const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed!'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter
});

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'petcare-hub') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [{ quality: 'auto', fetch_format: 'auto' }]
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private (Supplier, Admin, Customer)
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'Please provide an image file' });
        }

        const folder = req.body.folder || 'petcare-hub/products';

        if (isCloudinaryConfigured()) {
            const result = await uploadToCloudinary(req.file.buffer, folder);
            return res.status(200).json({
                status: 'success',
                message: 'Image uploaded successfully to Cloudinary',
                data: {
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height
                }
            });
        } else {
            // Local base64 data URI fallback for seamless development if Cloudinary credentials are not set
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            return res.status(200).json({
                status: 'success',
                message: 'Image processed (Local fallback mode. Configure Cloudinary credentials in .env for production storage)',
                data: {
                    url: base64Image,
                    publicId: `local_${Date.now()}`
                }
            });
        }
    } catch (error) {
        console.error('Upload Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Image upload failed'
        });
    }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private (Supplier, Admin, Customer)
exports.uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ status: 'fail', message: 'Please provide at least one image file' });
        }

        const folder = req.body.folder || 'petcare-hub/products';
        const uploadPromises = req.files.map(async (file) => {
            if (isCloudinaryConfigured()) {
                const result = await uploadToCloudinary(file.buffer, folder);
                return {
                    url: result.secure_url,
                    publicId: result.public_id
                };
            } else {
                return {
                    url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                    publicId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
                };
            }
        });

        const results = await Promise.all(uploadPromises);

        return res.status(200).json({
            status: 'success',
            message: 'Images uploaded successfully',
            data: {
                images: results
            }
        });
    } catch (error) {
        console.error('Multiple Upload Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Multiple image upload failed'
        });
    }
};

exports.multerUpload = upload;
