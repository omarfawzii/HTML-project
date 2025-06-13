// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');

// All ticket routes are protected
router.use(authMiddleware);

// GET /api/tickets - API endpoint to get all confirmed tickets
router.get('/', ticketController.getMyTickets);

module.exports = router;