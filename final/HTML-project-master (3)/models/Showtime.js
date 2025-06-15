const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    time: { type: Date, required: true },
    date: { type: Date, required: true },
    auditorium: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditorium', required: true }
});

// Index for faster querying
showtimeSchema.index({ movie: 1, date: 1 });
showtimeSchema.index({ auditorium: 1, date: 1, time: 1 });

module.exports = mongoose.model('Showtime', showtimeSchema);