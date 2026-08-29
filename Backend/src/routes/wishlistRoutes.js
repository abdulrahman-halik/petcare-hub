const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } = require('../controllers/wishlistController');

router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/:productId/check', checkWishlist);

module.exports = router;
