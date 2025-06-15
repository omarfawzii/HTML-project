
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        
        if (req.accepts('html', 'json') === 'json') {
        
            return res.status(401).json({ error: 'Authorization denied. No token.' });
        } else {
            
            return res.redirect('/');
        }
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.redirect('/');
        }
        req.user = user; 
        next();
    } catch (err) {
       
        if (req.accepts('html', 'json') === 'json') {
            return res.status(401).json({ error: 'Token is not valid.' });
        } else {
            return res.redirect('/');
        }
    }
};

module.exports = authMiddleware;