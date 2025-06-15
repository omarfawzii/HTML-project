// controllers/adminController.js
const Movie = require('../models/Movie');
const User = require('../models/User');
const Admin = require('../models/Admin');

exports.renderDashboard = (req, res) => res.render('admin/dashboard');

exports.renderManageMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.render('admin/manage-movies', { movies });
    } catch (err) {
        next(err);
    }
};

exports.addMovie = async (req, res, next) => {
    try {
        const { title, description, duration, rating, genres, trailer_url, release_date, category } = req.body;
        
        const newMovieData = {
            title, description, duration, rating, trailer_url, release_date, category,
            genres: genres ? genres.split(',').map(g => g.trim()) : [],
            is_featured: req.body.is_featured === 'on',
            poster_url: req.file ? `/uploads/${req.file.filename}` : '/images/default-poster.jpg'
        };

        const movie = new Movie(newMovieData);
        await movie.save();
        res.redirect('/admin/manage-movies');
    } catch (err) {
        next(err);
    }
};

// Add stubs for other admin functions to prevent crashes
exports.renderManageUsers = async (req, res, next) => {
    const users = await User.find();
    res.render('admin/manage-users', { users });
};
exports.renderManageAdmins = async (req, res, next) => {
    const admins = await Admin.find();
    res.render('admin/manage-admins', { admins });
};