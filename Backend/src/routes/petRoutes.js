const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
} = require('../controllers/petController');

// All pet routes are protected (require user to be logged in)
router.use(protect);

router.route('/')
    .get(getPets)
    .post(createPet);

router.route('/:id')
    .get(getPetById)
    .put(updatePet)
    .delete(deletePet);

module.exports = router;
