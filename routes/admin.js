// routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
// You should have an admin-only auth middleware here in a real app

// Setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Page Rendering Routes (now handled by pageRoutes.js)

// Form Submission / API Routes
router.post('/add-movie', upload.single('poster_image'), adminController.addMovie);
// Add other POST/DELETE routes for managing users and admins here

module.exports = router;