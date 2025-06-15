

const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.renderAuthPage = (req, res) => {
    
    res.render('index', { currentPage: 'login' });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);
        let user = await User.findOne({ email });
        let userType = 'user';

        if (!user) {
            console.log('Not found in user, checking admin collection...');
            const admins = await Admin.find();
            console.log('All admins:', admins.map(a => a.email));
            user = await Admin.findOne({ email });
            userType = 'admin';
            if (user) {
                console.log('Found in admin:', user.email);
            } else {
                console.log('Not found in admin collection either.');
            }
        }

        if (!user) {
            return res.status(401).json({ error: 'No account found with this email.' });
        }

        if (!user.comparePassword) {
            return res.status(500).json({ error: 'Password comparison method missing.' });
        }

        const valid = await user.comparePassword(password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id, type: userType, name: user.name } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3 * 60 * 60 * 1000 
        });

        res.status(200).json({ message: 'Login successful', userType, name: user.name });

    } catch (err) {
        console.error('LOGIN ERROR:', err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
};

exports.logout = (req, res) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 5 * 1000), 
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};


exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });
    user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered' });
};