// routes/seatingRoutes.js
const express = require('express');
const router = express.Router();
const seatingController = require('../controllers/seatingController');
const authMiddleware = require('../middleware/authMiddleware');

// This line applies our new smart middleware to ALL routes in this file.
router.use(authMiddleware);

// GET /seating?movieId=...
router.get('/', seatingController.renderSeatingPage);

// POST /seating/book
router.post('/book', seatingController.createBookingFromSeats);

module.exports = router;