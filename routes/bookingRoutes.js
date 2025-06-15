// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

// Get all bookings
router.get('/', auth, bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', auth, bookingController.getBookingById);

// Create new booking
router.post('/', auth, bookingController.createBooking);

// Update booking status
router.patch('/:id/status', auth, bookingController.updateBookingStatus);

// Update payment method
router.post('/:id/payment', auth, bookingController.updatePaymentMethod);

// Update payment status
router.post('/payment/status', auth, bookingController.updatePaymentStatus);

// Get user's bookings
router.get('/user/tickets', auth, bookingController.getUserBookings);

module.exports = router;