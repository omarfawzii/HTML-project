// middleware/viewGlobals.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    // Make variables available in all EJS templates
    res.locals.isLoggedIn = false;
    res.locals.user = null;
    res.locals.currentPage = req.path.split('/')[1] || 'home'; // e.g., 'food', 'upcoming'

    // Check for the auth token in cookies
    const token = req.cookies.token;

    if (token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Find the user
            const user = await User.findById(decoded.user.id).select('name email');
            
            if (user) {
                // If user is found, set user info for the template
                res.locals.isLoggedIn = true;
                res.locals.user = {
                    ...user.toObject(),
                    initials: user.name.match(/\b\w/g).join('').substring(0, 2).toUpperCase()
                };
            }
        } catch (err) {
            // If token is invalid, do nothing; user remains logged out
            console.error('Invalid token found:', err.message);
        }
    }
    
    next(); // Continue to the next middleware or route handler
};