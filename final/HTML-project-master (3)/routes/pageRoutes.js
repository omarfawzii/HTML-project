// routes/pageRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController');
const movieController = require('../controllers/movieController');
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

// --- Public Pages ---
router.get('/', authController.renderAuthPage);
router.get('/main', movieController.renderMainPage);
router.get('/upcoming', movieController.renderUpcomingPage);
router.get('/food', foodController.renderFoodPage); // This page is now correctly public

// --- Protected Pages (Uses our new smart middleware) ---
router.get('/mytickets', authMiddleware, bookingController.renderMyTickets);

module.exports = router;