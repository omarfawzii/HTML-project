const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
    try {
        // For now, allow access to admin routes without strict authentication
        // In production, you should implement proper admin authentication
        console.log('Admin route accessed:', req.path);
        next();
    } catch (err) {
        console.error('Admin auth error:', err);
        res.status(500).render('error', { 
            message: 'Authentication error',
            error: err 
        });
    }
};

module.exports = adminAuth; 