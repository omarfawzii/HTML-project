 
 const mongoose = require('mongoose');
const db = "mongodb+srv://ahmed2307881:6XKnNYQtNQd7fcvd@cluster0.xrthlhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(db)
  .then(() => {
    console.log("Connected to MongoDB Users Database");
  })
  .catch(() => {
    console.log("MongoDB Connection Failed");
  });

  
  const movieSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: [100, 'Movie title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true
    },
    poster_url: {
      type: String,
      default: '/images/default-poster.jpg'
    },
    trailer_url: String,
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [10, 'Rating cannot exceed 10']
    },
    duration: String,
    genres: {
      type: [String],
      required: true,
      enum: [
        'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 
        'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 
        'Thriller', 'Family', 'Animation', 'Documentary', 'Musical'
      ]
    },
    release_date: {
      type: Date,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['now_showing', 'upcoming'],
      default: 'now_showing'
    },
    is_featured: {
      type: Boolean,
      default: false
    },
    cast: [{
      name: String,
      role: String,
      photo_url: String
    }],
    director: String,
    language: String,
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  });
  
  const movies = mongoose.models.movies || mongoose.model("movies", movieSchema);
 module.exports = mongoose.model('databaseconnection', movieSchema);

module.exports = { movies };

