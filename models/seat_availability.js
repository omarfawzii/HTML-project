// models/seat_availability.js
const mongoose = require('mongoose');

const seatAvailabilitySchema = new mongoose.Schema({
    showtime_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    auditorium_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditorium', required: true },
    seat_number: { type: String, required: true },
    status: { type: String, enum: ['available', 'reserved', 'occupied'], default: 'available' },
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    reserved_until: { type: Date }
}, { timestamps: true });

seatAvailabilitySchema.index({ showtime_id: 1, seat_number: 1 }, { unique: true });

module.exports = mongoose.model('SeatAvailability', seatAvailabilitySchema);