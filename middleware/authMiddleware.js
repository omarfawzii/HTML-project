// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        // User is not logged in.
        // Check what kind of content the request is asking for.
        if (req.accepts('html', 'json') === 'json') {
            // It's an API request, send a JSON error.
            return res.status(401).json({ error: 'Authorization denied. No token.' });
        } else {
            // It's a page request, redirect to the login page.
            return res.redirect('/');
        }
    }

    try {
        // Token exists, now we verify it.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch the full user from the database
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.redirect('/');
        }
        req.user = user; // Now req.user is a full Mongoose user object
        next(); // Token is valid, proceed to the requested page/api.
    } catch (err) {
        // Token is invalid or expired.
        if (req.accepts('html', 'json') === 'json') {
            return res.status(401).json({ error: 'Token is not valid.' });
        } else {
            return res.redirect('/');
        }
    }
};

module.exports = authMiddleware;