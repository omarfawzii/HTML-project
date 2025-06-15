// db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // Use your database name if different from default
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) throw new Error('Database not connected');
  return db;
}

module.exports = { connectDB, getDB };