// models/Booking.js
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const bookingSchema = new mongoose.Schema({
    booking_reference: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    auditorium: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditorium', required: true },
    seats: [{ type: String, required: true }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'pending_payment', 'cancelled'], default: 'confirmed' },
    payment_method: { type: String, enum: ['visa', 'cash', 'none'], default: 'none' }
}, { timestamps: true });

// Pre-save hook to generate a unique booking reference
bookingSchema.pre('validate', function(next) {
    if (this.isNew) {
        const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
        this.booking_reference = `VOX-${nanoid()}`;
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);