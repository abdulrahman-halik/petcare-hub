const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middlewares/authMiddleware');
const {
    getRecommendations,
    getSinglePetRecommendations
} = require('../controllers/recommendationController');

// Public/Optional Auth endpoint for general & personalized recommendations
router.get('/', optionalAuth, getRecommendations);

// Specific Pet recommendations endpoint (requires authentication & pet ownership)
router.get('/pet/:petId', protect, getSinglePetRecommendations);

module.exports = router;
