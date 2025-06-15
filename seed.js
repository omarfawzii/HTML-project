const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Auditorium = require('./models/Auditorium');
const Showtime = require('./models/Showtime');
const SeatAvailability = require('./models/seat_availability');

const MONGODB_URI = 'mongodb+srv://ahmed2307881:PLEASEWORK@cluster0.xrthlhl.mongodb.net/vox_cinema?retryWrites=true&w=majority&appName=Cluster0';

const sampleMovies = [
    {
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
    },
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        poster_url: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        trailer_url: "https://www.youtube.com/embed/YoHD9XEInc0",
        release_date: new Date(),
        duration: 148,
        rating: "8.8",
        genres: ["Action", "Sci-Fi", "Thriller"],
        is_featured: true,
        category: "now_showing"
    },
    {
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        poster_url: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        trailer_url: "https://www.youtube.com/embed/EXeTwQWrcwY",
        release_date: new Date(),
        duration: 152,
        rating: "9.0",
        genres: ["Action", "Crime", "Drama"],
        is_featured: false,
        category: "now_showing"
    }
];

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Ensure at least one auditorium exists with a seat map
    let auditorium = await Auditorium.findOne();
    const seatRows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 6;
    const seat_map = {
        rows: seatRows.map(label => ({
            label,
            seats: Array.from({ length: seatsPerRow }, (_, i) => ({
                number: i + 1,
                type: 'standard',
                show_number: true
            }))
        }))
    };
    if (!auditorium) {
        auditorium = new Auditorium({
            name: 'Auditorium 1',
            type: 'standard',
            capacity: seatRows.length * seatsPerRow,
            seat_map
        });
        await auditorium.save();
        console.log('Created auditorium with seat map');
    } else {
        // Update seat_map if missing or empty
        if (!auditorium.seat_map || !auditorium.seat_map.rows || auditorium.seat_map.rows.length === 0) {
            auditorium.seat_map = seat_map;
            auditorium.capacity = seatRows.length * seatsPerRow;
            await auditorium.save();
            console.log('Updated auditorium with seat map');
        }
    }

    // 2. For every movie, create a showtime if missing
    const movies = await Movie.find();
    if (!movies.length) {
        console.log('No movies found. Please add a movie first.');
        process.exit(1);
    }
    for (const movie of movies) {
        let showtime = await Showtime.findOne({ movie: movie._id });
        if (!showtime) {
            showtime = new Showtime({
                movie: movie._id,
                time: new Date(Date.now() + 3600 * 1000), // 1 hour from now
                date: new Date(),
                auditorium: auditorium._id
            });
            await showtime.save();
            console.log(`Created showtime for movie: ${movie.title}`);
        }
        // Create seat availability for the showtime if missing
        for (const row of seatRows) {
            for (let num = 1; num <= seatsPerRow; num++) {
                const seat_number = `${row}${num}`;
                let seat = await SeatAvailability.findOne({ showtime_id: showtime._id, seat_number });
                if (!seat) {
                    seat = new SeatAvailability({
                        showtime_id: showtime._id,
                        auditorium_id: auditorium._id,
                        seat_number,
                        status: 'available'
                    });
                    await seat.save();
                }
            }
        }
        console.log(`Created seat availability for movie: ${movie.title}`);
    }
    console.log('Seeding complete! Every movie is now bookable and all auditoriums have seat maps.');
    process.exit(0);
}

seed(); 