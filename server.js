require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vox_cinemas',
    waitForConnections: true,
    connectionLimit: 10
});

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-strong-secret-here';

// Authentication Middleware
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Add this to server.js startup
db.query('SELECT COUNT(*) as count FROM movies WHERE category = "upcoming"')
  .then(([results]) => {
      console.log(`Database contains ${results[0].count} upcoming movies`);
  })
  .catch(err => {
      console.error('Database check failed:', err);
  });

// Helper function to handle database errors
const handleDbError = (err, res) => {
    console.error(err);
    res.status(500).json({ error: 'Database operation failed', details: err.message });
};
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 1. MOVIES ENDPOINTS

// Get all movies with filtering options
app.get('/api/movies', async (req, res) => {
    try {
        const { category, is_featured } = req.query;
        let query = 'SELECT * FROM movies';
        const params = [];
        
        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }
        
        if (is_featured) {
            query += category ? ' AND is_featured = ?' : ' WHERE is_featured = ?';
            params.push(is_featured);
        }
        
        const [movies] = await db.query(query, params);
        res.json(movies.map(movie => ({
            ...movie,
            genres: movie.genres ? movie.genres.split(',') : ['General']
        })));
    } catch (err) {
        handleDbError(err, res);
    }
});
// In server.js, replace the query with:
const [movies] = await db.query(`
    SELECT * FROM movies
    WHERE category = 'upcoming'
    LIMIT 5
`);
// Get movie details by ID
// Updated API endpoint with debug logging
app.get('/api/movies/upcoming', async (req, res) => {
    console.log("[DEBUG] Fetching upcoming movies...");
    try {
        const [movies] = await db.query(`
            SELECT 
                id, title, 
                COALESCE(description, 'Coming soon') AS description,
                COALESCE(poster_url, '/default-poster.jpg') AS poster_url,
                release_date
            FROM movies
            WHERE category = 'upcoming'
            AND release_date > CURDATE()
            ORDER BY release_date ASC
        `);

        console.log(`[DEBUG] Found ${movies.length} movies`); // Debug log

        // Transform nulls and ensure array
        const safeMovies = movies.map(movie => ({
            ...movie,
            genres: movie.genres?.split(',') || ['General']
        }));

        res.json({
            status: 'success',
            count: safeMovies.length,
            data: safeMovies
        });

    } catch (err) {
        console.error("[ERROR] Database query failed:", err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch movies',
            debug: process.env.NODE_ENV === 'development' ? err.message : null

        });
    }
});
// 2. SHOWTIME & SEATING ENDPOINTS

// Get showtimes with optional filtering
app.get('/api/showtimes', async (req, res) => {
    try {
        const { movie_id, date } = req.query;
        let query = `
            SELECT s.*, a.name as auditorium_name, a.type as auditorium_type
            FROM showtimes s
            JOIN auditoriums a ON s.auditorium_id = a.id
        `;
        const params = [];
        
        if (movie_id) {
            query += ' WHERE s.movie_id = ?';
            params.push(movie_id);
        }
        
        if (date) {
            query += movie_id ? ' AND s.date = ?' : ' WHERE s.date = ?';
            params.push(date);
        }
        
        const [showtimes] = await db.query(query, params);
        res.json(showtimes);
    } catch (err) {
        handleDbError(err, res);
    }
});

// Get showtime by ID
app.get('/api/showtimes/:id', async (req, res) => {
    try {
        const [showtimes] = await db.query(`
            SELECT s.*, a.name as auditorium_name, a.type as auditorium_type
            FROM showtimes s
            JOIN auditoriums a ON s.auditorium_id = a.id
            WHERE s.id = ?
        `, [req.params.id]);
        
        if (showtimes.length === 0) return res.status(404).json({ error: 'Showtime not found' });
        res.json(showtimes[0]);
    } catch (err) {
        handleDbError(err, res);
    }
});

// Get seating availability for a showtime
app.get('/api/seat_availability', async (req, res) => {
    try {
        const { showtime_id, auditorium_id } = req.query;
        if (!showtime_id || !auditorium_id) {
            return res.status(400).json({ error: 'showtime_id and auditorium_id are required' });
        }
        
        const [seats] = await db.query(`
            SELECT seat_number, status, booking_id, reserved_until 
            FROM seat_availability
            WHERE showtime_id = ? AND auditorium_id = ?
        `, [showtime_id, auditorium_id]);
        
        res.json(seats);
    } catch (err) {
        handleDbError(err, res);
    }
});

// 3. AUDITORIUM ENDPOINTS

// Get all auditoriums
app.get('/api/auditoriums', async (req, res) => {
    try {
        const [auditoriums] = await db.query('SELECT * FROM auditoriums');
        res.json(auditoriums.map(aud => ({
            ...aud,
            seat_map: aud.seat_map ? JSON.parse(aud.seat_map) : null,
            features: aud.features ? JSON.parse(aud.features) : null
        })));
    } catch (err) {
        handleDbError(err, res);
    }
});

// Get auditorium by ID
app.get('/api/auditoriums/:id', async (req, res) => {
    try {
        const [auditoriums] = await db.query('SELECT * FROM auditoriums WHERE id = ?', [req.params.id]);
        if (auditoriums.length === 0) return res.status(404).json({ error: 'Auditorium not found' });

        const auditorium = auditoriums[0];
        res.json({
            ...auditorium,
            seat_map: auditorium.seat_map ? JSON.parse(auditorium.seat_map) : null,
            features: auditorium.features ? JSON.parse(auditorium.features) : null
        });
    } catch (err) {
        handleDbError(err, res);
    }
});

// 4. BOOKINGS ENDPOINTS

// Get user bookings
app.get('/api/bookings', authenticate, async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, m.title as movie_title, m.poster_url, 
                   s.date as showtime_date, s.time as showtime_time,
                   a.name as auditorium_name
            FROM bookings b
            JOIN movies m ON b.movie_id = m.id
            JOIN showtimes s ON b.showtime_id = s.id
            JOIN auditoriums a ON b.auditorium_id = a.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.id]);
        
        res.json(bookings.map(booking => ({
            ...booking,
            seats: booking.seats.split(','),
            showtime: `${booking.showtime_date} ${booking.showtime_time}`
        })));
    } catch (err) {
        handleDbError(err, res);
    }
});

// Create a new booking
app.post('/api/bookings', authenticate, async (req, res) => {
    try {
        const { movie_id, showtime_id, auditorium_id, seats, total } = req.body;
        
        // Validate input
        if (!movie_id || !showtime_id || !auditorium_id || !seats || !seats.length || !total) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check seat availability
        const [unavailable] = await db.query(`
            SELECT seat_number FROM seat_availability
            WHERE showtime_id = ? AND auditorium_id = ? 
            AND seat_number IN (?)
            AND status != 'available'
        `, [showtime_id, auditorium_id, seats]);
        
        if (unavailable.length > 0) {
            return res.status(400).json({
                error: 'Some seats are unavailable',
                unavailableSeats: unavailable.map(s => s.seat_number)
            });
        }
        
        // Create booking
        const booking_ref = `VOX-${Date.now().toString(36).toUpperCase()}`;
        const [result] = await db.query(`
            INSERT INTO bookings (
                booking_reference, user_id, movie_id, 
                showtime_id, auditorium_id, seats, 
                total, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        `, [booking_ref, req.user.id, movie_id, showtime_id, auditorium_id, seats.join(','), total]);
        
        // Update seat availability
        await db.query(`
            INSERT INTO seat_availability (
                showtime_id, auditorium_id, seat_number, 
                status, booking_id, reserved_until
            ) VALUES ?
            ON DUPLICATE KEY UPDATE 
                status = 'reserved',
                booking_id = VALUES(booking_id),
                reserved_until = VALUES(reserved_until)
        `, [seats.map(seat => [
            showtime_id, 
            auditorium_id, 
            seat, 
            'reserved', 
            result.insertId,
            new Date(Date.now() + 15 * 60 * 1000) // 15 minutes reservation
        ])]);
        
        res.json({
            bookingId: result.insertId,
            bookingReference: booking_ref
        });
    } catch (err) {
        handleDbError(err, res);
    }
});

// 5. FOOD & DRINKS ENDPOINTS

// Get all food categories
app.get('/api/food/categories', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM food_categories WHERE is_active = 1');
        res.json(categories);
    } catch (err) {
        handleDbError(err, res);
    }
});

// Get food menu with categories
app.get('/api/food/menu', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM food_categories WHERE is_active = 1');
        const [items] = await db.query(`
            SELECT fi.*, fc.name as category_name 
            FROM food_items fi
            JOIN food_categories fc ON fi.category_id = fc.id
            WHERE fi.is_available = 1
            ORDER BY fc.display_order, fi.display_order
        `);
        
        const menu = categories.map(category => ({
            id: category.id,
            name: category.name,
            description: category.description,
            image_url: category.image_url,
            items: items.filter(item => item.category_id === category.id)
                .map(item => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: parseFloat(item.price),
                    image_url: item.image_url,
                    is_available: item.is_available,
                    display_order: item.display_order,
                    dietary_info: item.dietary_info ? JSON.parse(item.dietary_info) : null
                }))
        }));
        
        res.json(menu);
    } catch (err) {
        handleDbError(err, res);
    }
});

// Create food order
app.post('/api/food/orders', authenticate, async (req, res) => {
    try {
        const { booking_id, items, special_requests } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }
        
        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create order
        const order_ref = `FOOD-${Date.now().toString(36).toUpperCase()}`;
        const [result] = await db.query(`
            INSERT INTO food_orders (
                order_reference, user_id, booking_id, 
                total_amount, status, special_requests
            ) VALUES (?, ?, ?, ?, 'pending', ?)
        `, [order_ref, req.user.id, booking_id, total, special_requests]);
        
        // Add order items
        await db.query(`
            INSERT INTO order_items (
                order_id, food_item_id, quantity, 
                price_at_order, special_instructions
            ) VALUES ?
        `, [items.map(item => [
            result.insertId, 
            item.id, 
            item.quantity, 
            item.price,
            item.special_instructions || null
        ])]);
        
        res.json({
            orderId: result.insertId,
            orderReference: order_ref,
            total: total
        });
    } catch (err) {
        handleDbError(err, res);
    }
});

// Get user food orders
app.get('/api/food/orders', authenticate, async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT fo.*, 
                   b.booking_reference,
                   m.title as movie_title,
                   s.date as showtime_date,
                   s.time as showtime_time
            FROM food_orders fo
            LEFT JOIN bookings b ON fo.booking_id = b.id
            LEFT JOIN movies m ON b.movie_id = m.id
            LEFT JOIN showtimes s ON b.showtime_id = s.id
            WHERE fo.user_id = ?
            ORDER BY fo.created_at DESC
        `, [req.user.id]);
        
        // Get order items for each order
        for (const order of orders) {
            const [items] = await db.query(`
                SELECT oi.*, fi.name, fi.image_url
                FROM order_items oi
                JOIN food_items fi ON oi.food_item_id = fi.id
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }
        
        res.json(orders);
    } catch (err) {
        handleDbError(err, res);
    }
});

// 6. AUTHENTICATION ENDPOINTS

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        // Generate token
        const token = jwt.sign(
            { id: result.insertId, email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            token, 
            userId: result.insertId,
            user: { id: result.insertId, name, email }
        });
    } catch (err) {
        handleDbError(err, res);
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Find user
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            token, 
            userId: user.id,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        handleDbError(err, res);
    }
});

// Get current user
app.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (err) {
        handleDbError(err, res);
    }
});

// 7. REMINDERS ENDPOINTS

// Set movie reminder
app.post('/api/reminders', authenticate, async (req, res) => {
    try {
        const { movie_id, remind_date } = req.body;
        
        // Check if reminder already exists
        const [existing] = await db.query(`
            SELECT * FROM reminders 
            WHERE user_id = ? AND movie_id = ?
        `, [req.user.id, movie_id]);
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Reminder already set for this movie' });
        }
        
        // Create reminder
        const [result] = await db.query(`
            INSERT INTO reminders (user_id, movie_id, remind_date)
            VALUES (?, ?, ?)
        `, [req.user.id, movie_id, remind_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]);
        
        res.json({ success: true, reminderId: result.insertId });
    } catch (err) {
        handleDbError(err, res);
    }
});

// 8. PAYMENT PROCESSING

// Process payment for booking
app.post('/api/payments/process', authenticate, async (req, res) => {
    try {
        const { booking_id, card_number, expiry, cvv, amount } = req.body;
        
        // Validate payment details
        if (!/^\d{16}$/.test(card_number)) throw new Error('Invalid card number');
        if (!/^\d{2}\/\d{2}$/.test(expiry)) throw new Error('Invalid expiry');
        if (!/^\d{3,4}$/.test(cvv)) throw new Error('Invalid CVV');
        
        // In production: Connect to real payment gateway here
        const payment_id = `pay_${Date.now()}`;
        
        // Update booking
        await db.query(`
            UPDATE bookings 
            SET status = 'confirmed', 
                payment_method = 'card',
                payment_reference = ?
            WHERE id = ? AND user_id = ?
        `, [payment_id, booking_id, req.user.id]);
        
        // Update seats
        await db.query(`
            UPDATE seat_availability
            SET status = 'booked'
            WHERE booking_id = ?
        `, [booking_id]);
        
        res.json({ 
            success: true,
            paymentId: payment_id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});