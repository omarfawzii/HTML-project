const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController'); // We need this for rendering the food page
const Admin = require('../models/Admin');
const User = require('../models/User');
const Movie = require('../models/Movie');


router.get('/', authController.renderAuthPage);


router.get('/main', async (req, res, next) => {
    try {
        const nowShowingMovies = await Movie.find({ category: 'now_showing' })
                                           .sort({ release_date: -1 });
        res.render('main', { nowShowingMovies });
    } catch (err) {
        next(err);
    }
});


router.get('/food', foodController.renderFoodPage);


router.get('/admin/register', (req, res) => {
  res.render('auth/admin-register');
});


router.post('/admin/register', async (req, res) => {
  const { name, email, password } = req.body;
  await Admin.create({ name, email, password });
  res.redirect('/admin/dashboard');
});


router.get('/admin/login', (req, res) => {
  res.render('auth/admin-login');
});

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email, password });
  if (admin) {
    
    res.redirect('/admin/dashboard');
  } else {
    res.render('auth/admin-login', { error: 'Invalid credentials' });
  }
});


router.get('/user/register', (req, res) => {
  res.render('auth/user-register');
});


router.post('/user/register', async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({ name, email, password });
  res.redirect('/main');
});


router.get('/user/login', (req, res) => {
  res.render('auth/user-login');
});


router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    
    res.redirect('/main');
  } else {
    res.render('auth/user-login', { error: 'Invalid credentials' });
  }
});


router.post('/login', authController.login);


router.post('/register', authController.register);

router.post('/auth/user/register', authController.register);
router.post('/auth/login', authController.login);


router.get('/logout', (req, res) => {
    req.session?.destroy?.();
    res.clearCookie('connect.sid');
    res.redirect('/');
});


router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;