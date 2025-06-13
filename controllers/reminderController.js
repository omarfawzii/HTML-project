// controllers/reminderController.js
const Reminder = require('../models/Reminder');
const Movie = require('../models/Movie');

// Get all reminders for the logged-in user
exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ user_id: req.user.id }).populate('movie_id');
        const formattedReminders = reminders.map(r => ({
            id: r._id,
            movie_id: r.movie_id._id,
            title: r.movie_id.title,
            poster_url: r.movie_id.poster_url,
            release_date: r.movie_id.release_date
        }));
        res.json(formattedReminders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
};

// Create a new reminder
exports.createReminder = async (req, res) => {
    try {
        const { movie_id } = req.body;
        const movie = await Movie.findById(movie_id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const newReminder = new Reminder({
            user_id: req.user.id,
            movie_id: movie_id,
            remind_date: movie.release_date // Set reminder for the release date
        });

        await newReminder.save();
        res.status(201).json(newReminder);
    } catch (err) {
        // Handle duplicate key error gracefully
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Reminder already exists for this movie.' });
        }
        res.status(500).json({ error: 'Failed to create reminder' });
    }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
    try {
        await Reminder.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
        res.status(200).json({ message: 'Reminder removed' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove reminder' });
    }
};