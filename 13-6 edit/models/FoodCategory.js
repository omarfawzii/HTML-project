const mongoose = require('mongoose');

const foodCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    image_url: String,
    display_order: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('FoodCategory', foodCategorySchema);