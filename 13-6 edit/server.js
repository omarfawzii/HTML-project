// File: server.js (Final Cleaned Version)

// 1. IMPORTS & SETUP
require('dotenv').config();



const cookieParser = require('cookie-parser');           // <-- ADD THIS
const viewGlobals = require('./middleware/viewGlobals');
const securityMiddleware = require('./middleware/security');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Your route files
const pageRoutes = require('./routes/pageRoutes');
const authApiRoutes = require('./routes/authRoutes');
const foodApiRoutes = require('./routes/foodRoutes');
const movieApiRoutes = require('./routes/movieRoutes');
const reminderApiRoutes = require('./routes/reminderRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const seatingRoutes = require('./routes/seatingRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const adminRoutes = require('./routes/admin');
const confirmationRoutes = require('./routes/confirmationRoutes');


// 2. INITIALIZATION & DATABASE
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Success! Securely connected to MongoDB Atlas!'))
    .catch((err) => {
        console.error('❌ FATAL: MongoDB connection error:', err);
        process.exit(1);
    });


// 3. CORE & SECURITY MIDDLEWARE
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'", "https:", "http:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'unsafe-hashes'", "https:", "http:"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
            imgSrc: ["'self'", "data:", "https:", "http:", "blob:", "*"],
            connectSrc: ["'self'", "https:", "http:"],
            fontSrc: ["'self'", "https:", "http:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "https:", "http:"],
            frameSrc: ["'self'", "https:", "http:"],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["'self'", "blob:"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
        },
        useDefaults: false
    }
}));
app.use(securityMiddleware); // Use our custom security middleware

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(hpp());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());



// --- GLOBAL VIEW MIDDLEWARE ---
// This runs on EVERY request and provides global variables (isLoggedIn, user, currentPage) to ALL EJS templates
app.use(viewGlobals);


// 4. ROUTING
console.log("⚙️  Mounting application routes...");
app.use('/api/auth', authApiRoutes);
app.use('/api/food', foodApiRoutes);
app.use('/api/movies', movieApiRoutes);
app.use('/api/reminders', reminderApiRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);

app.use('/seating', seatingRoutes);
app.use('/admin', adminRoutes);
app.use('/confirmation', confirmationRoutes);
app.use('/', pageRoutes);


// 5. FINAL DEBUGGING ERROR HANDLER
app.use((req, res, next) => {
    const error = new Error(`Page Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error("--- DETAILED ERROR TRACE ---");
    console.error(err);
    res.status(err.status || 500).send(`
        <div style="font-family: monospace; white-space: pre-wrap; padding: 20px; background-color: #f8f8f8; border: 1px solid #ccc;">
            <h1>An Error Occurred</h1>
            <h2>Message: ${err.message}</h2>
            <hr>
            <h3>Stack Trace:</h3>
            <p>${err.stack}</p>
        </div>
    `);
});


// 6. START THE SERVER
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running securely on http://localhost:${PORT}`);
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);