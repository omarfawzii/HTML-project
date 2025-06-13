// File: routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController'); // We need this for rendering the food page
const Admin = require('../models/Admin');
const User = require('../models/User');

// --- Page Rendering Routes ---

// Show the main login/signup page at the root URL
router.get('/', authController.renderAuthPage);

// Show the main movies page
router.get('/main', (req, res) => {
    // Assuming you have a main.ejs view for your movies
    res.render('main');
});

// Show the food & drinks page
router.get('/food', foodController.renderFoodPage);

// Admin Registration Form
router.get('/admin/register', (req, res) => {
  res.render('auth/admin-register');
});

// Admin Registration Handler
router.post('/admin/register', async (req, res) => {
  const { name, email, password } = req.body;
  await Admin.create({ name, email, password });
  res.redirect('/admin/dashboard');
});

// Admin Login Form
router.get('/admin/login', (req, res) => {
  res.render('auth/admin-login');
});

// Admin Login Handler
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email, password });
  if (admin) {
    // In production, use sessions/cookies
    res.redirect('/admin/dashboard');
  } else {
    res.render('auth/admin-login', { error: 'Invalid credentials' });
  }
});

// User Registration Form
router.get('/user/register', (req, res) => {
  res.render('auth/user-register');
});

// User Registration Handler
router.post('/user/register', async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({ name, email, password });
  res.redirect('/main');
});

// User Login Form
router.get('/user/login', (req, res) => {
  res.render('auth/user-login');
});

// User Login Handler
router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    // In production, use sessions/cookies
    res.redirect('/main');
  } else {
    res.render('auth/user-login', { error: 'Invalid credentials' });
  }
});

// --- Authentication API Routes ---

// Handle the API call for user login
router.post('/login', authController.login);

// Handle the API call for user registration
router.post('/register', authController.register);

router.post('/auth/user/register', authController.register);
router.post('/auth/login', authController.login);

module.exports = router;