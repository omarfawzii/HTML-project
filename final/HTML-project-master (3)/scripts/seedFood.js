// Usage: node scripts/seedFood.js
const mongoose = require('mongoose');
const FoodCategory = require('../models/FoodCategory');
const FoodItem = require('../models/FoodItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vox';

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Create categories
  const categories = await FoodCategory.insertMany([
    { name: 'Popcorn', description: 'Freshly popped popcorn', display_order: 1 },
    { name: 'Drinks', description: 'Cold beverages', display_order: 2 },
    { name: 'Snacks', description: 'Tasty snacks', display_order: 3 }
  ]);

  // Create food items
  await FoodItem.insertMany([
    {
      category_id: categories[0]._id,
      name: 'Salted Popcorn',
      description: 'Classic salted popcorn.',
      price: 4.00,
      image_url: '',
      is_available: true
    },
    {
      category_id: categories[0]._id,
      name: 'Caramel Popcorn',
      description: 'Sweet caramel popcorn.',
      price: 5.00,
      image_url: '',
      is_available: true
    },
    {
      category_id: categories[1]._id,
      name: 'Coke',
      description: 'Chilled Coca-Cola.',
      price: 3.00,
      image_url: '',
      is_available: true
    },
    {
      category_id: categories[1]._id,
      name: 'Sprite',
      description: 'Refreshing Sprite.',
      price: 3.00,
      image_url: '',
      is_available: true
    },
    {
      category_id: categories[2]._id,
      name: 'Nachos',
      description: 'Crispy nachos with cheese.',
      price: 6.00,
      image_url: '',
      is_available: true
    }
  ]);

  console.log('Seeded food categories and items!');
  await mongoose.disconnect();
}

seed(); 