// routes/pageRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController');
const movieController = require('../controllers/movieController');
const ticketController = require('../controllers/ticketController');
const seatingController = require('../controllers/seatingController');
const confirmationController = require('../controllers/confirmationController');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// --- Public Pages ---
router.get('/', authController.renderAuthPage);
router.get('/main', movieController.renderMainPage);
router.get('/upcoming', movieController.renderUpcomingPage);
router.get('/food', foodController.renderFoodPage);

// --- Protected User Pages ---
router.get('/mytickets', authMiddleware, ticketController.renderMyTicketsPage);
router.get('/seating', authMiddleware, seatingController.renderSeatingPage);
router.get('/confirmation', authMiddleware, confirmationController.renderConfirmationPage);

// --- Protected Admin Pages ---
router.get('/admin/dashboard', authMiddleware, adminController.renderDashboard);
router.get('/admin/manage-movies', authMiddleware, adminController.renderManageMovies);
router.get('/admin/manage-users', authMiddleware, adminController.renderManageUsers);
router.get('/admin/manage-admins', authMiddleware, adminController.renderManageAdmins);

module.exports = router;