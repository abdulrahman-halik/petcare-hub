const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    uploadImage,
    uploadMultipleImages,
    multerUpload
} = require('../controllers/uploadController');

// All upload routes require authentication
router.post('/', protect, multerUpload.single('image'), uploadImage);
router.post('/multiple', protect, multerUpload.array('images', 8), uploadMultipleImages);

module.exports = router;
