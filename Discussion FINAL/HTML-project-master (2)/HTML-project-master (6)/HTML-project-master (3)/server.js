// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// --- Route Imports ---
const pageRoutes = require('./routes/pageRoutes');
const authApiRoutes = require('./routes/authRoutes');
const movieApiRoutes = require('./routes/movieRoutes');
const foodApiRoutes = require('./routes/foodRoutes');
const bookingApiRoutes = require('./routes/bookingRoutes');
const seatingRoutes = require('./routes/seatingRoutes');
const reminderApiRoutes = require('./routes/reminderRoutes');
const adminRoutes = require('./routes/admin');
const ticketRoutes = require('./routes/ticketRoutes');
const confirmationRoutes = require('./routes/confirmationRoutes');

// --- Initialization ---
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;

// --- Database Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Success! Securely connected to MongoDB Atlas!'))
    .catch((err) => {
        console.error('❌ FATAL: MongoDB connection error:', err);
        process.exit(1);
    });

// --- Core Middleware ---
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Global View Middleware ---
const viewGlobals = require('./middleware/viewGlobals');
app.use(viewGlobals);

// --- ROUTING ---
console.log("⚙️  Mounting application routes...");
app.use('/api/auth', authApiRoutes);
app.use('/api/movies', movieApiRoutes);
app.use('/api/food', foodApiRoutes);
app.use('/api/bookings', bookingApiRoutes);
app.use('/api/reminders', reminderApiRoutes);
app.use('/api/tickets', ticketRoutes);

app.use('/seating', seatingRoutes);
app.use('/admin', adminRoutes);
app.use('/confirmation', confirmationRoutes);
app.use('/', require('./routes/authRoutes'));
// Page-Rendering routes must be last
app.use('/', pageRoutes);

// --- Error Handling ---
app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Page Not Found' });
});
app.use((err, req, res, next) => {
    console.error('ERROR 💥', err);
    res.status(500).render('error', {
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// --- Server Start ---
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running securely on http://localhost:${PORT}`);
});
