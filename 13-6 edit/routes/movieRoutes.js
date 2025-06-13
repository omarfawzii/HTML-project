// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Handles GET /api/movies
router.get('/', movieController.getMovies);

// Handles GET /api/movies/upcoming
router.get('/upcoming', movieController.getUpcomingMovies);

// Handles GET /api/movies/featured
router.get('/featured', movieController.getFeaturedMovie);

// Handles GET /api/movies/:id
router.get('/:id', movieController.getMovieDetails);

module.exports = router;