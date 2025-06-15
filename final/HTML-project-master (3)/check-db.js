const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const MONGODB_URI = 'mongodb+srv://ahmed2307881:PLEASEWORK@cluster0.xrthlhl.mongodb.net/vox_cinema?retryWrites=true&w=majority&appName=Cluster0';

async function checkDatabase() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB!');

        // Check if we can find any movies
        const movies = await Movie.find({});
        console.log('Found movies:', movies.length);
        
        if (movies.length > 0) {
            console.log('Sample movie data:', JSON.stringify(movies[0], null, 2));
        } else {
            console.log('No movies found in database');
        }

        // Check the database name
        console.log('Current database:', mongoose.connection.db.databaseName);
        
        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in database:', collections.map(c => c.name));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

checkDatabase(); 