// middleware/viewGlobals.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
    res.locals.isLoggedIn = false;
    res.locals.user = null;
    res.locals.isAdmin = false;
    
    const path = req.path.split('/')[1] || 'home';
    res.locals.currentPage = path;

    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            let foundUser;
            if (decoded.user.type === 'admin') {
                foundUser = await Admin.findById(decoded.user.id).select('name email');
                if (foundUser) res.locals.isAdmin = true;
            } else {
                foundUser = await User.findById(decoded.user.id).select('name email');
            }

            if (foundUser) {
                res.locals.isLoggedIn = true;
                res.locals.user = {
                    ...foundUser.toObject(),
                    initials: foundUser.name.match(/\b\w/g)?.join('').substring(0, 2).toUpperCase() || 'U'
                };
            }
        } catch (err) { /* Invalid token, do nothing */ }
    }
    next();
};