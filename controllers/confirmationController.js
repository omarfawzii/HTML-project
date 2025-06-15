// controllers/confirmationController.js
const Booking = require('../models/Booking');

exports.renderConfirmationPage = async (req, res, next) => {
    try {
        const bookingRef = req.query.ref; // Get the reference from the URL, e.g., /confirmation?ref=VOX-12345

        if (!bookingRef) {
            return res.status(400).render('error', { message: 'No booking reference was provided.' });
        }

        // Find the booking that belongs to the logged-in user
        const booking = await Booking.findOne({ booking_reference: bookingRef, user: req.user.id })
            .populate('movie')
            .populate({
                path: 'showtime',
                populate: { path: 'auditorium' } // Also get auditorium details
            });

        if (!booking) {
            return res.status(404).render('error', { message: 'We could not find that booking.' });
        }

        // Render the confirmation page and pass the complete booking object
        res.render('confirmation', { booking });

    } catch (error) {
        next(error); // Pass any errors to the main error handler
    }
};