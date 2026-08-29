const Pet = require('../models/Pet');
const Reminder = require('../models/Reminder');

// @desc    Get all pets for authenticated user
// @route   GET /api/pets
// @access  Private (Customer, Admin)
exports.getPets = async (req, res) => {
    try {
        const query = {};
        
        // Admins can filter by owner, customers only see their own pets
        if (req.user.role === 'admin' && req.query.owner) {
            query.owner = req.query.owner;
        } else {
            query.owner = req.user._id;
        }

        const pets = await Pet.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            status: 'success',
            results: pets.length,
            data: { pets }
        });
    } catch (error) {
        console.error('Get Pets Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch pets'
        });
    }
};

// @desc    Get a single pet by ID
// @route   GET /api/pets/:id
// @access  Private
exports.getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({
                status: 'fail',
                message: 'Pet not found'
            });
        }

        // Ownership verification
        if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'You are not authorized to view this pet profile'
            });
        }

        // Also fetch any upcoming reminders for this pet
        const reminders = await Reminder.find({ pet: pet._id }).sort({ dueDate: 1 });

        return res.status(200).json({
            status: 'success',
            data: {
                pet,
                reminders
            }
        });
    } catch (error) {
        console.error('Get Pet By ID Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch pet details'
        });
    }
};

// @desc    Create a new pet profile
// @route   POST /api/pets
// @access  Private
exports.createPet = async (req, res) => {
    try {
        const {
            name,
            species,
            breed,
            age,
            birthDate,
            gender,
            weight,
            activityLevel,
            medicalConditions,
            allergies,
            dietaryPreferences,
            microchipNumber,
            imageUrl
        } = req.body;

        if (!name || !species) {
            return res.status(400).json({
                status: 'fail',
                message: 'Pet name and species are required'
            });
        }

        // Process array inputs if sent as comma-separated strings or arrays
        const parseArray = (input) => {
            if (!input) return [];
            if (Array.isArray(input)) return input.map(i => typeof i === 'string' ? i.trim() : i).filter(Boolean);
            if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };

        const pet = await Pet.create({
            name: name.trim(),
            species,
            breed: breed ? breed.trim() : 'Mixed / Other',
            age: age !== undefined && age !== '' ? Number(age) : 1,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            gender: gender || 'unknown',
            weight: weight !== undefined && weight !== '' ? Number(weight) : 5,
            activityLevel: activityLevel || 'moderate',
            medicalConditions: parseArray(medicalConditions),
            allergies: parseArray(allergies),
            dietaryPreferences: parseArray(dietaryPreferences),
            microchipNumber: microchipNumber ? microchipNumber.trim() : '',
            imageUrl: imageUrl || '',
            owner: req.user._id
        });

        return res.status(201).json({
            status: 'success',
            message: 'Pet profile created successfully',
            data: { pet }
        });
    } catch (error) {
        console.error('Create Pet Error:', error);
        return res.status(400).json({
            status: 'fail',
            message: error.message || 'Failed to create pet profile'
        });
    }
};

// @desc    Update a pet profile
// @route   PUT /api/pets/:id
// @access  Private
exports.updatePet = async (req, res) => {
    try {
        let pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({
                status: 'fail',
                message: 'Pet not found'
            });
        }

        // Ownership verification
        if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'You are not authorized to edit this pet profile'
            });
        }

        const parseArray = (input) => {
            if (input === undefined) return undefined;
            if (Array.isArray(input)) return input.map(i => typeof i === 'string' ? i.trim() : i).filter(Boolean);
            if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };

        const updates = { ...req.body };
        if (updates.medicalConditions !== undefined) updates.medicalConditions = parseArray(updates.medicalConditions);
        if (updates.allergies !== undefined) updates.allergies = parseArray(updates.allergies);
        if (updates.dietaryPreferences !== undefined) updates.dietaryPreferences = parseArray(updates.dietaryPreferences);
        if (updates.age !== undefined && updates.age !== '') updates.age = Number(updates.age);
        if (updates.weight !== undefined && updates.weight !== '') updates.weight = Number(updates.weight);
        if (updates.birthDate) updates.birthDate = new Date(updates.birthDate);

        // Prevent modifying owner
        delete updates.owner;

        pet = await Pet.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            status: 'success',
            message: 'Pet profile updated successfully',
            data: { pet }
        });
    } catch (error) {
        console.error('Update Pet Error:', error);
        return res.status(400).json({
            status: 'fail',
            message: error.message || 'Failed to update pet profile'
        });
    }
};

// @desc    Delete a pet profile and associated reminders
// @route   DELETE /api/pets/:id
// @access  Private
exports.deletePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({
                status: 'fail',
                message: 'Pet not found'
            });
        }

        // Ownership verification
        if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'You are not authorized to delete this pet profile'
            });
        }

        // Cascade delete reminders associated with this pet
        await Reminder.deleteMany({ pet: pet._id });

        await Pet.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            status: 'success',
            message: 'Pet profile and associated reminders deleted successfully'
        });
    } catch (error) {
        console.error('Delete Pet Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to delete pet profile'
        });
    }
};
