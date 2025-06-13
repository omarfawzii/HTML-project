// controllers/bookingController.js
const Booking = require('../models/Booking');
const SeatAvailability = require('../models/seat_availability');

// 1. Create a booking
exports.createBooking = async (req, res, next) => {
  try {
    const { movieId, showtimeId, auditoriumId, seats, total, status } = req.body;
    const userId = req.user.id || req.user._id || req.user;

    const alreadyOccupied = await SeatAvailability.find({
      showtime_id: showtimeId,
      seat_number: { $in: seats },
      status: 'occupied'
    });

    if (alreadyOccupied.length > 0) {
      return res.status(409).json({ error: `Seats ${alreadyOccupied.map(s => s.seat_number).join(', ')} are already taken.` });
    }

    const bookingStatus = status || 'confirmed';
    const newBooking = new Booking({
      user: userId,
      movie: movieId,
      showtime: showtimeId,
      auditorium: auditoriumId,
      seats: seats,
      total: total,
      status: bookingStatus
    });
    await newBooking.save();

    // Only reserve seats if booking is confirmed
    if (bookingStatus === 'confirmed') {
      await SeatAvailability.updateMany(
        { showtime_id: showtimeId, seat_number: { $in: seats } },
        { $set: { status: 'occupied', booking_id: newBooking._id } }
      );
    }

    res.status(201).json({
      message: 'Booking successful!',
      bookingReference: newBooking.booking_reference
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get all bookings for the logged-in user
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie', 'title poster_url')
      .populate({
        path: 'showtime',
        populate: { path: 'auditorium', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// 3. Get a specific booking by its ID
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id }).populate('movie showtime');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// 4. Cancel a booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    await SeatAvailability.updateMany(
      { booking_id: booking._id },
      { $set: { status: 'available', booking_id: null } }
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

exports.renderMyTickets = async (req, res, next) => {
    try {
        if (!req.user || (!req.user.id && !req.user._id)) {
            return res.status(401).render('error', { message: 'You must be logged in to view your tickets.' });
        }
        const userId = req.user.id || req.user._id || req.user;
        const Booking = require('../models/Booking');
        const bookings = await Booking.find({ user: userId })
            .populate('movie')
            .populate('showtime')
            .populate('auditorium');
        res.render('bookings/mytickets', { bookings });
    } catch (error) {
        next(error);
    }
};

exports.updatePaymentMethod = async (req, res, next) => {
  try {
    const { payment_method } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.payment_method = payment_method;
    booking.status = 'confirmed';
    await booking.save();

    res.json({ message: 'Payment method updated', booking });
  } catch (error) {
    next(error);
  }
};

exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { bookingReference, paymentMethod, paymentStatus } = req.body;
    const booking = await Booking.findOne({ booking_reference: bookingReference });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update payment details
    booking.payment_method = paymentMethod;
    booking.payment_status = paymentStatus;
    
    // If payment is successful, update booking status to confirmed
    if (paymentStatus === 'paid') {
      booking.status = 'confirmed';
      
      // Reserve the seats now that payment is confirmed
      await SeatAvailability.updateMany(
        { 
          showtime_id: booking.showtime,
          seat_number: { $in: booking.seats }
        },
        { 
          $set: { 
            status: 'occupied',
            booking_id: booking._id
          }
        }
      );
    }

    await booking.save();
    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('movie', 'title poster_url')
      .populate({
        path: 'showtime',
        populate: { path: 'auditorium', select: 'name' }
      })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // If booking is cancelled, free up the seats
    if (status === 'cancelled') {
      await SeatAvailability.updateMany(
        { booking_id: booking._id },
        { $set: { status: 'available', booking_id: null } }
      );
    }

    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    next(error);
  }
};