// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    poster_url: { type: String, required: true },
    trailer_url: { type: String },
    release_date: { type: Date, required: true },
    duration: { type: String, required: true },
    rating: { type: String, required: true },
    genres: [{ type: String }],
    is_featured: { type: Boolean, default: false },
    category: {
        type: String,
        enum: ['now_showing', 'upcoming'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);