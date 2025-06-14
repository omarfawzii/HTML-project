// models/Auditorium.js
const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    type: { type: String, default: 'standard' }, // e.g., 'standard', 'vip', 'wheelchair'
    show_number: { type: Boolean, default: false }
}, { _id: false });

const rowSchema = new mongoose.Schema({
    label: { type: String, required: true },
    seats: [seatSchema]
}, { _id: false });

const auditoriumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['standard', 'vip', 'imax', 'dolby'], default: 'standard' },
    capacity: { type: Number, required: true },
    has_3d: { type: Boolean, default: false },
    has_dolby: { type: Boolean, default: false },
    seat_map: {
        rows: [rowSchema]
    },
    features: { type: mongoose.Schema.Types.Mixed } // For extra JSON data like 'love_seats'
}, { timestamps: true });

module.exports = mongoose.model('Auditorium', auditoriumSchema);