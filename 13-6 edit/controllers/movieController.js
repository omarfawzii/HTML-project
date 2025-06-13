// controllers/movieController.js

const Movie = require('../models/Movie');

// Renders the "Now Showing" page
exports.renderMainPage = async (req, res, next) => {
    try {
        const nowShowingMovies = await Movie.find({ category: 'now_showing' }).sort({ release_date: -1 });
        // FIX: Add the currentPage variable here
// NEW, CLEANER WAY
res.render('main', { nowShowingMovies });
    } catch (error) {
        next(error);
    }
};

// Renders the "Upcoming" page
exports.renderUpcomingPage = async (req, res, next) => {
    try {
        const [featuredMovie, upcomingMovies] = await Promise.all([
            Movie.findOne({ category: 'upcoming', is_featured: true }).sort({ release_date: 1 }),
            Movie.find({ category: 'upcoming' }).sort({ release_date: 1 })
        ]);
        // FIX: Add the currentPage variable here
        res.render('upcoming', {
            featuredMovie: featuredMovie || upcomingMovies[0] || null,
            upcomingMovies: upcomingMovies || [],
            currentPage: 'upcoming'
        });
    } catch (error) {
        next(error);
    }
};


// --- API functions below do not need changes ---
exports.getMovies = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        const movies = await Movie.find(filter).sort({ release_date: -1 });
        res.json({ data: movies });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
};

exports.getUpcomingMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ category: 'upcoming' }).sort({ release_date: 1 });
        res.json({ data: movies });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch upcoming movies' });
    }
};

exports.getMovieDetails = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching movie details' });
    }
};

exports.getFeaturedMovie = async (req, res) => {
    try {
        let movie = await Movie.findOne({ category: 'upcoming', is_featured: true }).sort({ release_date: 1 });
        if (!movie) {
            movie = await Movie.findOne({ category: 'upcoming' }).sort({ release_date: 1 });
        }
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching featured movie' });
    }
};