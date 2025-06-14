// controllers/seatingController.js
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const SeatAvailability = require('../models/seat_availability');
const Auditorium = require('../models/Auditorium');

// This function renders the seating page with all necessary data
exports.renderSeatingPage = async (req, res, next) => {
    try {
        const { movieId, showtimeId } = req.query;

        if (!movieId) {
            return res.status(400).render('error', { message: 'No movie was selected. Please go back and choose a movie first.' });
        }

        const [movie, showtimes] = await Promise.all([
            Movie.findById(movieId),
            Showtime.find({ movie: movieId }).populate('auditorium')
        ]);

        if (!movie || showtimes.length === 0) {
            return res.status(404).render('error', { message: 'The selected movie or its showtimes could not be found.' });
        }

        const currentShowtime = showtimes.find(st => st._id.equals(showtimeId)) || showtimes[0];

        const seatAvailability = await SeatAvailability.find({ showtime_id: currentShowtime._id });

        res.render('seating', {
            movie,
            showtimes,
            currentShowtime,
            seatAvailability
        });

    } catch (error) {
        next(error);
    }
};

// This function handles the final booking creation
exports.createBookingFromSeats = async (req, res, next) => {
    try {
        const { movieId, showtimeId, seats, total } = req.body;
        const showtime = await Showtime.findById(showtimeId).populate('auditorium');

        const occupiedSeats = await SeatAvailability.find({
            showtime_id: showtimeId,
            seat_number: { $in: seats },
            status: 'occupied'
        });

        if (occupiedSeats.length > 0) {
            return res.status(409).json({ error: 'Sorry, one or more selected seats were just taken.' });
        }
        
        const Booking = require('../models/Booking'); // Require Booking model here
        const newBooking = new Booking({
            user: req.user.id,
            movie: movieId,
            showtime: showtimeId,
            auditorium: showtime.auditorium._id,
            seats,
            total,
            status: 'pending_payment'
        });
        await newBooking.save();

        await SeatAvailability.updateMany(
            { showtime_id: showtimeId, seat_number: { $in: seats } },
            { $set: { status: 'occupied', booking_id: newBooking._id } }
        );
        
        res.status(201).json({ bookingReference: newBooking.booking_reference });

    } catch (error) {
        next(error);
    }
};

// Note: The booking logic below already saves the booking with the user ID and marks seats as occupied for the showtime.