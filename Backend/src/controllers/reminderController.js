const Reminder = require('../models/Reminder');
const Pet = require('../models/Pet');

// @desc    Get all reminders for current user
// @route   GET /api/reminders
// @access  Private
exports.getReminders = async (req, res) => {
    try {
        const { pet, type, status, month, year, upcoming } = req.query;
        const query = { owner: req.user._id };

        if (pet) {
            query.pet = pet;
        }

        if (type && type !== 'all') {
            query.type = type;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        // Date range filtering
        if (month !== undefined && year !== undefined) {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
            query.dueDate = { $gte: startDate, $lte: endDate };
        } else if (upcoming === 'true') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.dueDate = { $gte: today };
        }

        const reminders = await Reminder.find(query)
            .populate('pet', 'name species breed imageUrl')
            .sort({ dueDate: 1, time: 1 });

        return res.status(200).json({
            status: 'success',
            results: reminders.length,
            data: { reminders }
        });
    } catch (error) {
        console.error('Get Reminders Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch reminders'
        });
    }
};

// @desc    Get single reminder by ID
// @route   GET /api/reminders/:id
// @access  Private
exports.getReminderById = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id)
            .populate('pet', 'name species breed imageUrl');

        if (!reminder) {
            return res.status(404).json({
                status: 'fail',
                message: 'Reminder not found'
            });
        }

        if (reminder.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Unauthorized to view this reminder'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: { reminder }
        });
    } catch (error) {
        console.error('Get Reminder By ID Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch reminder'
        });
    }
};

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
exports.createReminder = async (req, res) => {
    try {
        const { petId, title, type, dueDate, time, frequency, notes } = req.body;

        if (!petId || !title || !dueDate) {
            return res.status(400).json({
                status: 'fail',
                message: 'Pet, reminder title, and due date are required'
            });
        }

        // Verify pet ownership
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({
                status: 'fail',
                message: 'Selected pet not found'
            });
        }

        if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'You can only schedule reminders for your own pets'
            });
        }

        const reminder = await Reminder.create({
            owner: req.user._id,
            pet: pet._id,
            title: title.trim(),
            type: type || 'other',
            dueDate: new Date(dueDate),
            time: time || '09:00 AM',
            frequency: frequency || 'once',
            notes: notes ? notes.trim() : '',
            status: 'pending',
            isAutomated: false
        });

        const populated = await Reminder.findById(reminder._id)
            .populate('pet', 'name species breed imageUrl');

        return res.status(201).json({
            status: 'success',
            message: 'Reminder scheduled successfully',
            data: { reminder: populated }
        });
    } catch (error) {
        console.error('Create Reminder Error:', error);
        return res.status(400).json({
            status: 'fail',
            message: error.message || 'Failed to create reminder'
        });
    }
};

// @desc    Update a reminder
// @route   PUT /api/reminders/:id
// @access  Private
exports.updateReminder = async (req, res) => {
    try {
        let reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({
                status: 'fail',
                message: 'Reminder not found'
            });
        }

        if (reminder.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Unauthorized to edit this reminder'
            });
        }

        const updates = { ...req.body };
        if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
        delete updates.owner;

        reminder = await Reminder.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        }).populate('pet', 'name species breed imageUrl');

        return res.status(200).json({
            status: 'success',
            message: 'Reminder updated successfully',
            data: { reminder }
        });
    } catch (error) {
        console.error('Update Reminder Error:', error);
        return res.status(400).json({
            status: 'fail',
            message: error.message || 'Failed to update reminder'
        });
    }
};

// @desc    Update reminder status (quick toggle completed/pending)
// @route   PATCH /api/reminders/:id/status
// @access  Private
exports.updateReminderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'completed', 'overdue', 'dismissed'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'fail',
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        let reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({
                status: 'fail',
                message: 'Reminder not found'
            });
        }

        if (reminder.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Unauthorized to update this reminder status'
            });
        }

        reminder.status = status;
        await reminder.save();

        const populated = await Reminder.findById(reminder._id)
            .populate('pet', 'name species breed imageUrl');

        return res.status(200).json({
            status: 'success',
            message: `Reminder status updated to ${status}`,
            data: { reminder: populated }
        });
    } catch (error) {
        console.error('Update Status Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update reminder status'
        });
    }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
exports.deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({
                status: 'fail',
                message: 'Reminder not found'
            });
        }

        if (reminder.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Unauthorized to delete this reminder'
            });
        }

        await Reminder.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            status: 'success',
            message: 'Reminder deleted successfully'
        });
    } catch (error) {
        console.error('Delete Reminder Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to delete reminder'
        });
    }
};

// @desc    1-Click Automated Preventive Care Plan Generator for a Pet
// @route   POST /api/reminders/generate-plan/:petId
// @access  Private
exports.generateAutomatedCarePlan = async (req, res) => {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({
                status: 'fail',
                message: 'Pet not found'
            });
        }

        if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Unauthorized to generate health plan for this pet'
            });
        }

        const now = new Date();
        const addDays = (days) => {
            const d = new Date(now);
            d.setDate(d.getDate() + days);
            return d;
        };

        const planTemplates = [];

        // Templates tailored by species & age
        if (pet.species === 'dog') {
            planTemplates.push(
                {
                    title: `Rabies & DHPP Vaccination Booster for ${pet.name}`,
                    type: 'vaccination',
                    dueDate: addDays(21),
                    time: '10:00 AM',
                    frequency: 'yearly',
                    notes: 'Core annual rabies and distemper/parvovirus booster immunization.',
                    isAutomated: true
                },
                {
                    title: `Monthly Flea, Tick & Heartworm Prevention Chew`,
                    type: 'medication',
                    dueDate: addDays(5),
                    time: '08:30 AM',
                    frequency: 'monthly',
                    notes: 'Administer tasty chewable with breakfast for 30-day parasite defense.',
                    isAutomated: true
                },
                {
                    title: `Deep Coat Bath, De-shed & Nail Trim Session`,
                    type: 'grooming',
                    dueDate: addDays(14),
                    time: '02:00 PM',
                    frequency: 'monthly',
                    notes: 'Full coat wash with soothing oatmeal shampoo, ear cleaning, and paw pad trim.',
                    isAutomated: true
                },
                {
                    title: `Comprehensive Annual Vet Checkup & Dental Scaling`,
                    type: 'vet-visit',
                    dueDate: addDays(90),
                    time: '11:00 AM',
                    frequency: 'yearly',
                    notes: 'Full body physical, heart & joint assessment, and dental tartar evaluation.',
                    isAutomated: true
                }
            );
        } else if (pet.species === 'cat') {
            planTemplates.push(
                {
                    title: `FVRCP 3-in-1 Feline Vaccine Booster for ${pet.name}`,
                    type: 'vaccination',
                    dueDate: addDays(30),
                    time: '10:30 AM',
                    frequency: 'yearly',
                    notes: 'Protection against feline viral rhinotracheitis, calicivirus and panleukopenia.',
                    isAutomated: true
                },
                {
                    title: `Monthly Topical Flea & Ear Mite Defense`,
                    type: 'medication',
                    dueDate: addDays(7),
                    time: '09:00 AM',
                    frequency: 'monthly',
                    notes: 'Apply single-dose spot-on treatment at base of neck.',
                    isAutomated: true
                },
                {
                    title: `Slicker Brush Fur De-matting & Claw Trimming`,
                    type: 'grooming',
                    dueDate: addDays(10),
                    time: '05:00 PM',
                    frequency: 'weekly',
                    notes: 'Gentle deshedding to prevent hairballs and keep claws at comfortable length.',
                    isAutomated: true
                },
                {
                    title: `Annual Senior Vitality Exam & Bloodwork`,
                    type: 'vet-visit',
                    dueDate: addDays(120),
                    time: '09:30 AM',
                    frequency: 'yearly',
                    notes: 'Kidney function, thyroid, and dental plaque examination.',
                    isAutomated: true
                }
            );
        } else {
            planTemplates.push(
                {
                    title: `Routine Health & Vitality Examination for ${pet.name}`,
                    type: 'vet-visit',
                    dueDate: addDays(30),
                    time: '11:00 AM',
                    frequency: 'yearly',
                    notes: 'General wellness check, weight monitoring, and dietary assessment.',
                    isAutomated: true
                },
                {
                    title: `Habitat Deep Clean & Sanitization Cycle`,
                    type: 'other',
                    dueDate: addDays(7),
                    time: '04:00 PM',
                    frequency: 'weekly',
                    notes: 'Sanitize bedding, replenish fresh filters/substrate, and check temperature.',
                    isAutomated: true
                }
            );
        }

        // Insert reminders
        const toCreate = planTemplates.map(t => ({
            ...t,
            owner: req.user._id,
            pet: pet._id,
            status: 'pending'
        }));

        const createdReminders = await Reminder.insertMany(toCreate);

        const populated = await Reminder.find({ _id: { $in: createdReminders.map(r => r._id) } })
            .populate('pet', 'name species breed imageUrl');

        return res.status(201).json({
            status: 'success',
            message: `Automated Vet Health Plan with ${createdReminders.length} scheduled reminders generated for ${pet.name}!`,
            data: {
                reminders: populated
            }
        });
    } catch (error) {
        console.error('Generate Care Plan Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to generate care plan'
        });
    }
};
