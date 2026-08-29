const Reminder = require('../models/Reminder');
const Notification = require('../models/Notification');

/**
 * Runs a single check cycle for due and overdue reminders
 */
const checkRemindersNow = async () => {
    try {
        const now = new Date();

        // 1. Find and update overdue reminders
        const overdueResult = await Reminder.updateMany(
            {
                dueDate: { $lt: now },
                status: 'pending'
            },
            {
                $set: { status: 'overdue' }
            }
        );

        if (overdueResult.modifiedCount > 0) {
            console.log(`[Scheduler] Marked ${overdueResult.modifiedCount} reminder(s) as overdue.`);
        }

        // 2. Find upcoming reminders in the next 48 hours that have not been notified
        const upcomingWindow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        const dueReminders = await Reminder.find({
            dueDate: { $lte: upcomingWindow },
            status: { $in: ['pending', 'overdue'] },
            notified: false
        }).populate('pet', 'name species');

        let createdNotifications = 0;

        for (const reminder of dueReminders) {
            const petName = reminder.pet ? reminder.pet.name : 'Your Pet';
            const formattedDate = new Date(reminder.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });

            await Notification.create({
                user: reminder.owner,
                title: `🐾 Pet Care Reminder: ${reminder.title}`,
                message: `Upcoming care event for ${petName} scheduled for ${formattedDate} at ${reminder.time || 'all day'}. Notes: ${reminder.notes || 'No extra notes'}`,
                type: 'Reminder',
                isRead: false
            });

            reminder.notified = true;
            await reminder.save();
            createdNotifications++;
        }

        if (createdNotifications > 0) {
            console.log(`[Scheduler] Generated ${createdNotifications} reminder notification(s).`);
        }

        return {
            overdueUpdated: overdueResult.modifiedCount || 0,
            notificationsCreated: createdNotifications
        };
    } catch (error) {
        console.error('[Scheduler] Error checking reminders:', error.message);
        return { error: error.message };
    }
};

/**
 * Initialize background scheduler worker
 */
const initReminderScheduler = (intervalMs = 60 * 60 * 1000) => { // Defaults to 1 hour
    console.log('⏰ Initializing Pet Care Reminder Background Scheduler...');
    
    // Run an initial check after a brief startup delay
    setTimeout(() => {
        checkRemindersNow();
    }, 5000);

    // Run periodically
    const interval = setInterval(() => {
        checkRemindersNow();
    }, intervalMs);

    // Ensure interval does not prevent process exit in test runners
    if (interval.unref) {
        interval.unref();
    }

    return interval;
};

module.exports = {
    initReminderScheduler,
    checkRemindersNow
};
