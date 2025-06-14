const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController'); // We need this for rendering the food page
const Admin = require('../models/Admin');
const User = require('../models/User');
const Movie = require('../models/Movie');

// --- Page Rendering Routes ---

// Show the main login/signup page at the root URL
router.get('/', authController.renderAuthPage);

// Show the main movies page
router.get('/main', async (req, res, next) => {
    try {
        const nowShowingMovies = await Movie.find({ category: 'now_showing' })
                                           .sort({ release_date: -1 });
        res.render('main', { nowShowingMovies });
    } catch (err) {
        next(err);
    }
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

// Logout route
router.get('/logout', (req, res) => {
    req.session?.destroy?.();
    res.clearCookie('connect.sid');
    res.redirect('/');
});

// POST logout route for admin dashboard
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;