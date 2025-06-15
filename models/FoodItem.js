const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodCategory',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    image_url: String,
    is_available: {
        type: Boolean,
        default: true
    },
    dietary_info: {
        vegetarian: Boolean,
        vegan: Boolean,
        glutenFree: Boolean
    }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);