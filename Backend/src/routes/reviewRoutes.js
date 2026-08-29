const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { updateReview, deleteReview } = require('../controllers/reviewController');

// Review management (scoped to /api/reviews)
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
