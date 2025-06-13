// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    poster_url: { type: String, required: true },
    trailer_url: { type: String },
    release_date: { type: Date, required: true },
    duration: { type: String, required: true }, // Changed to String to match your SQL data (e.g., "2h 49m")
    rating: { type: String, required: true },
    genres: [{ type: String }],
    is_featured: { type: Boolean, default: false },
    category: {
        type: String,
        // CRITICAL FIX: Changed 'coming_soon' to 'upcoming' to match the controller and frontend
        enum: ['now_showing', 'upcoming'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);