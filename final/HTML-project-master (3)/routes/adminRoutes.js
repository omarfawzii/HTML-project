const express = require('express');
const router = express.Router();
const adminFoodController = require('../controllers/adminFoodController');

// GET admin food page
router.get('/food', adminFoodController.renderAdminFoodPage);
// POST new food item
router.post('/food', adminFoodController.addFoodItem);

module.exports = router; 