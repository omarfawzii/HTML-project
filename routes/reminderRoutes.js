// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const authMiddleware = require('../middleware/authMiddleware');

// All reminder routes are protected and require a user to be logged in
router.use(authMiddleware);

// GET /api/reminders
router.get('/', reminderController.getReminders);

// POST /api/reminders
router.post('/', reminderController.createReminder);

// DELETE /api/reminders/:id
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;