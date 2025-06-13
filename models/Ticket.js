const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' },
    auditorium: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditorium' },
    seats: [String], // array of seat numbers
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    qr_code: { type: String }, // can be generated or a link to QR image
    issued_at: { type: Date, default: Date.now },
    total: { type: Number }
});

module.exports = mongoose.model('Ticket', ticketSchema);