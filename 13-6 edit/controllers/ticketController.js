// controllers/ticketController.js
const Booking = require('../models/Booking'); // Tickets are derived from bookings

// This function will render the "My Tickets" page with data
exports.renderMyTicketsPage = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id, status: 'confirmed' })
            //... (populate logic)
            .sort({ createdAt: -1 });
        
        // Add currentPage: 'tickets'
        res.render('bookings/mytickets', { bookings, currentPage: 'tickets' });
    } catch (error) {
        next(error);
    }
};

// API function to get all tickets (confirmed bookings) for a user
exports.getMyTickets = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id, status: 'confirmed' })
            .populate('movie', 'title')
            .sort({ createdAt: -1 });

        // In a real app, you might format this data specifically as a "ticket"
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};