const Movie = require('../models/Movie');
const mongoose = require('mongoose');

console.log("Script started");
process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', function (err) {
  console.error('Unhandled Rejection:', err);
});

exports.renderMain = async (req, res) => {
    try {
        console.log('Starting renderMain function...');
        
        // Check database connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected');
        }
        console.log('Database connection status:', mongoose.connection.readyState);

        // Fetch featured movies
        console.log('Fetching featured movies...');
        const featuredMovies = await Movie.find({ is_featured: true })
            .sort({ release_date: -1 })
            .limit(4);
        console.log('Featured movies found:', featuredMovies.length);

        // Fetch now showing movies
        console.log('Fetching now showing movies...');
        const nowShowingMovies = await Movie.find({ 
            category: 'now_showing',
            is_featured: false 
        })
        .sort({ release_date: -1 })
        .limit(8);
        console.log('Now showing movies found:', nowShowingMovies.length);

        // Fetch coming soon movies
        console.log('Fetching coming soon movies...');
        const comingSoonMovies = await Movie.find({ 
            category: 'coming_soon' 
        })
        .sort({ release_date: 1 })
        .limit(4);
        console.log('Coming soon movies found:', comingSoonMovies.length);

        // Log the data being sent to the view
        console.log('Data being sent to view:', {
            featuredCount: featuredMovies.length,
            nowShowingCount: nowShowingMovies.length,
            comingSoonCount: comingSoonMovies.length
        });

        // If no movies found, create sample data
        if (featuredMovies.length === 0 && nowShowingMovies.length === 0 && comingSoonMovies.length === 0) {
            console.log('No movies found, creating sample data...');
            const sampleMovie = new Movie({
                title: "The Matrix",
                description: "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
                poster_url: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
                trailer_url: "https://www.youtube.com/embed/vKQi3bBA1y8",
                release_date: new Date(),
                duration: 136,
                rating: "8.7",
                genres: ["Action", "Sci-Fi"],
                is_featured: true,
                category: "now_showing"
            });

            await sampleMovie.save();
            console.log('Sample movie created successfully');
            
            // Fetch the newly created movie
            const newMovie = await Movie.findOne({ title: "The Matrix" });
            return res.render('main', {
                featuredMovies: [newMovie],
                nowShowingMovies: [newMovie],
                comingSoonMovies: [],
                currentPage: 'home'
            });
        }

        // Render the view with the movie data
        res.render('main', {
            featuredMovies,
            nowShowingMovies,
            comingSoonMovies,
            currentPage: 'home'
        });
    } catch (error) {
        console.error('Detailed error in renderMain:', error);
        // Render the error page with currentPage to avoid header.ejs error
        res.status(500).render('error', {
            message: 'Failed to fetch movie',
            error,
            currentPage: 'home'
        });
    }
}; 