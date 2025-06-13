// routes/confirmationRoutes.js
const express = require('express');
const router = express.Router();
const confirmationController = require('../controllers/confirmationController');
const authMiddleware = require('../middleware/authMiddleware');

// This route requires a user to be logged in
router.get('/', authMiddleware, confirmationController.renderConfirmationPage);

module.exports = router;