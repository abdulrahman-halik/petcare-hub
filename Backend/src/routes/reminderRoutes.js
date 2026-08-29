const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getReminders,
    getReminderById,
    createReminder,
    updateReminder,
    updateReminderStatus,
    deleteReminder,
    generateAutomatedCarePlan
} = require('../controllers/reminderController');

// All reminder endpoints require authentication
router.use(protect);

router.route('/')
    .get(getReminders)
    .post(createReminder);

router.post('/generate-plan/:petId', generateAutomatedCarePlan);

router.route('/:id')
    .get(getReminderById)
    .put(updateReminder)
    .delete(deleteReminder);

router.patch('/:id/status', updateReminderStatus);

module.exports = router;
