const Reminder = require('../models/Reminder');
const Pet = require('../models/Pet');
const { buildCarePlanTemplates } = require('../services/carePlanService');

// @desc    Get all reminders for current user
// @route   GET /api/reminders
// @access  Private
exports.getReminders = async (req, res) => {
    try {
        const { pet, type, status, month, year, upcoming } = req.query;
        const query = { owner: req.user._id };

        if (pet) query.pet = pet;
        if (type && type !== 'all') query.type = type;
        if (status && status !== 'all') query.status = status;

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
            return res.status(404).json({ status: 'fail', message: 'Reminder not found' });
        }

        if (reminder.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized to view this reminder' });
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

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ status: 'fail', message: 'Selected pet not found' });
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
        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) {
            return res.status(404).json({ status: 'fail', message: 'Reminder not found' });
        }

        if (reminder.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized to edit this reminder' });
        }

        const updates = { ...req.body };
        if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
        delete updates.owner;

        const updated = await Reminder.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        }).populate('pet', 'name species breed imageUrl');

        return res.status(200).json({
            status: 'success',
            message: 'Reminder updated successfully',
            data: { reminder: updated }
        });
    } catch (error) {
        console.error('Update Reminder Error:', error);
        return res.status(400).json({
            status: 'fail',
            message: error.message || 'Failed to update reminder'
        });
    }
};

// @desc    Update reminder status
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

        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) {
            return res.status(404).json({ status: 'fail', message: 'Reminder not found' });
        }

        if (reminder.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized to update this reminder status' });
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
            return res.status(404).json({ status: 'fail', message: 'Reminder not found' });
        }

        if (reminder.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized to delete this reminder' });
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
            return res.status(404).json({ status: 'fail', message: 'Pet not found' });
        }

        if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Unauthorized to generate health plan for this pet'
            });
        }

        const planTemplates = buildCarePlanTemplates(pet);
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
            data: { reminders: populated }
        });
    } catch (error) {
        console.error('Generate Care Plan Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to generate care plan'
        });
    }
};
