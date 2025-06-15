// models/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    remind_date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

// Prevent duplicate reminders for the same user and movie
reminderSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

module.exports = mongoose.model('Reminder', reminderSchema);