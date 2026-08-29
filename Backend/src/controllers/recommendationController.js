const Pet = require('../models/Pet');
const recommendationService = require('../services/recommendationService');

// @desc    Get smart product recommendations for current user (or guest)
// @route   GET /api/recommendations
// @access  Public / Optional Auth
exports.getRecommendations = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        let pets = [];

        // If user is authenticated, find all their pets
        if (req.user) {
            pets = await Pet.find({ owner: req.user._id });
        }

        const recommendations = await recommendationService.getRecommendationsForPets(pets, { limit });

        return res.status(200).json({
            status: 'success',
            hasPets: pets.length > 0,
            petCount: pets.length,
            results: recommendations.length,
            data: {
                recommendations
            }
        });
    } catch (error) {
        console.error('Get Recommendations Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch product recommendations'
        });
    }
};

// @desc    Get recommendations specifically for a single pet
// @route   GET /api/recommendations/pet/:petId
// @access  Private
exports.getSinglePetRecommendations = async (req, res) => {
    try {
        const { petId } = req.params;
        const limit = parseInt(req.query.limit) || 8;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({
                status: 'fail',
                message: 'Pet not found'
            });
        }

        // Validate ownership if not admin
        if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Unauthorized to view recommendations for this pet'
            });
        }

        const recommendations = await recommendationService.getRecommendationsForSinglePet(pet, limit);

        return res.status(200).json({
            status: 'success',
            pet: {
                _id: pet._id,
                name: pet.name,
                species: pet.species,
                age: pet.age,
                breed: pet.breed
            },
            results: recommendations.length,
            data: {
                recommendations
            }
        });
    } catch (error) {
        console.error('Get Single Pet Recommendations Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch recommendations for pet'
        });
    }
};
