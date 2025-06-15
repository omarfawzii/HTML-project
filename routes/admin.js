const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Admin = require('../models/Admin');
const mainController = require('../controllers/mainController');
const User = require('../models/User');
const path = require('path');
const adminController = require('../controllers/adminController');
const multer = require('multer');
const adminAuth = require('../middleware/adminAuth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


router.use(adminAuth);


router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.getAllMovies();
    res.render('movie_management', { movies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


router.post('/movies', async (req, res) => {
  try {
    const newMovie = {
      title: req.body.title,
      genres: req.body.genres.split(',').map(g => g.trim()),
      rating: req.body.rating,
      poster_url: req.body.poster_url,
      trailer_url: req.body.trailer_url,
      is_featured: req.body.is_featured === 'on'
    };
    
    await Movie.addMovie(newMovie);
    res.redirect('/admin/movies');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


router.get('/dashboard', (req, res) => {
  console.log('Rendering admin dashboard EJS');
  res.render('admin/dashboard');
});


router.get('/manage-movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render('admin/manage-movies', { movies });
  } catch (err) {
    res.status(500).send('Error fetching movies');
  }
});


router.post('/manage-movies', upload.single('poster_image'), adminController.addMovie);


router.post('/manage-movies/delete/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/admin/manage-movies');
  } catch (err) {
    res.status(500).send('Error deleting movie');
  }
});


router.get('/manage-movies/edit/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    const movies = await Movie.find();
    res.render('admin/manage-movies', { editMovie: movie, movies });
  } catch (err) {
    res.status(500).send('Error loading edit form');
  }
});


router.post('/manage-movies/edit/:id', async (req, res) => {
  try {
    const { title, description, poster_url, trailer_url, release_date, duration, rating, genres, is_featured, category } = req.body;
    await Movie.findByIdAndUpdate(req.params.id, {
      title,
      description,
      poster_url,
      trailer_url,
      release_date,
      duration,
      rating,
      genres: genres.split(',').map(g => g.trim()),
      is_featured: is_featured === 'on',
      category
    });
    res.redirect('/admin/manage-movies');
  } catch (err) {
    res.status(500).send('Error editing movie');
  }
});


router.get('/manage-admins', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.render('admin/manage-admins', { admins });
  } catch (err) {
    res.status(500).send('Error fetching admins');
  }
});


router.post('/manage-admins', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await Admin.create({ name, email, password });
    res.redirect('/admin/manage-admins');
  } catch (err) {
    res.status(500).send('Error adding admin: ' + err.message);
  }
});


router.post('/manage-admins/delete/:id', async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.redirect('/admin/manage-admins');
  } catch (err) {
    res.status(500).send('Error deleting admin: ' + err.message);
  }
});


router.get('/manage-admins/edit/:id', async (req, res) => {
  try {
    const editAdmin = await Admin.findById(req.params.id);
    const admins = await Admin.find();
    res.render('admin/manage-admins', { editAdmin, admins });
  } catch (err) {
    res.status(500).send('Error loading edit form');
  }
});


router.post('/manage-admins/edit/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await Admin.findByIdAndUpdate(req.params.id, { name, email, password });
    res.redirect('/admin/manage-admins');
  } catch (err) {
    res.status(500).send('Error editing admin');
  }
});


router.get('/manage-users', async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/manage-users', { users });
  } catch (err) {
    res.status(500).render('error', { message: 'Error fetching users', error: err });
  }
});

router.post('/manage-users/delete/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/manage-users');
  } catch (err) {
    res.status(500).render('error', { message: 'Error deleting user', error: err });
  }
});

router.post('/manage-users', adminController.addUser);

router.get('/', mainController.renderMain);

module.exports = router;