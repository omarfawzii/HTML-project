const { nanoid } = require('nanoid');
const User = require('../models/User');
const Movie = require('../models/Movie');

exports.addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.redirect('/admin/manage-users');
  } catch (err) {
    res.status(500).render('error', { message: 'Failed to add user', error: err });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const { title, genre, duration, rating, description, trailer_url, release_date, category } = req.body;
    const is_featured = req.body.is_featured === 'on';
    const poster_url = req.file ? '/uploads/' + req.file.filename : '/images/default-poster.jpg';
    const newMovie = new Movie({
      title,
      genres: [genre],
      duration,
      rating,
      description,
      poster_url,
      trailer_url,
      release_date,
      category,
      is_featured
    });
    await newMovie.save();
    res.redirect('/admin/manage-movies');
  } catch (err) {
    res.status(500).render('error', { message: 'Failed to add movie', error: err });
  }
};
