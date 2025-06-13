const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Route for main page
router.get('/', mainController.renderMain);

module.exports = router; 