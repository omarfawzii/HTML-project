const FoodCategory = require('../models/FoodCategory');
const FoodItem = require('../models/FoodItem');

exports.renderAdminFoodPage = async (req, res) => {
    const categories = await FoodCategory.find({ is_active: true }).sort('display_order');
    res.render('admin_food', { categories, message: null });
};

exports.addFoodItem = async (req, res) => {
    try {
        const { name, description, price, image_url, category_id } = req.body;
        const is_available = req.body.is_available === 'on';
        const dietary_info = {
            vegetarian: !!req.body.dietary_info?.vegetarian,
            vegan: !!req.body.dietary_info?.vegan,
            glutenFree: !!req.body.dietary_info?.glutenFree
        };
        await FoodItem.create({
            name,
            description,
            price,
            image_url,
            category_id,
            is_available,
            dietary_info
        });
        const categories = await FoodCategory.find({ is_active: true }).sort('display_order');
        res.render('admin_food', { categories, message: 'Food item added successfully!' });
    } catch (err) {
        const categories = await FoodCategory.find({ is_active: true }).sort('display_order');
        res.render('admin_food', { categories, message: 'Error adding food item.' });
    }
}; 