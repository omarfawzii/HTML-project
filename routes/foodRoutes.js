// File: routes/foodRoutes.js

const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middleware/authMiddleware');

// --- DEBUGGING STEP ---
// This will tell you if your controller functions are being imported correctly.
console.log('Is createFoodOrder a function?', typeof foodController.createFoodOrder === 'function');
console.log('Is authMiddleware a function?', typeof authMiddleware === 'function');
// --------------------

// GET /api/food/menu
router.get('/menu', foodController.getFoodMenu);

// GET /api/food/categories
router.get('/categories', foodController.getFoodCategories);

// POST /api/food/orders
// This route is protected. A user must be logged in to create an order.
router.post('/orders', authMiddleware, foodController.createFoodOrder);

module.exports = router;