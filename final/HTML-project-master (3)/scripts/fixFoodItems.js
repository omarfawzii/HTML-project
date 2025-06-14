// Usage: node scripts/fixFoodItems.js
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const FoodItem = require('../models/FoodItem');
const FoodCategory = require('../models/FoodCategory');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vox';

// Optionally, provide a mapping from old category_id numbers to ObjectIds here:
const categoryMap = {
  1: null, // Fill in with the correct ObjectId for Popcorn
  2: null, // Fill in with the correct ObjectId for Drinks
  3: null  // Fill in with the correct ObjectId for Snacks
};

async function fixFoodItems() {
  await mongoose.connect(MONGO_URI);

  // If you need to fill in categoryMap, fetch categories and print them
  const categories = await FoodCategory.find();
  console.log('Available categories:');
  categories.forEach(cat => {
    console.log(cat.name, cat._id.toString());
  });

  // Update all food_items
  const items = await FoodItem.find();
  for (const item of items) {
    let needsUpdate = false;
    const update = {};

    // Fix is_available
    if (typeof item.is_available === 'number') {
      update.is_available = !!item.is_available;
      needsUpdate = true;
    }

    // Fix dietary_info
    if (typeof item.dietary_info === 'string') {
      try {
        update.dietary_info = JSON.parse(item.dietary_info);
        needsUpdate = true;
      } catch (e) {
        update.dietary_info = {};
        needsUpdate = true;
      }
    }

    // Fix category_id if it's a number and mapping is provided
    if (typeof item.category_id === 'number' && categoryMap[item.category_id]) {
      update.category_id = ObjectId(categoryMap[item.category_id]);
      needsUpdate = true;
    }

    if (needsUpdate) {
      await FoodItem.updateOne({ _id: item._id }, { $set: update });
      console.log('Updated:', item.name);
    }
  }

  await mongoose.disconnect();
  console.log('All done!');
}

fixFoodItems(); 