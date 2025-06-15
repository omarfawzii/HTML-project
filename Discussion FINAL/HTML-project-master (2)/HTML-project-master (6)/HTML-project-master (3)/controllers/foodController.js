const FoodItem = require('../models/FoodItem');
const FoodOrder = require('../models/FoodOrder');
const FoodCategory = require('../models/FoodCategory');
console.log('🍟🍔 THIS IS THE FOOD CONTROLLER IN USE!!');

// Page rendring
exports.renderFoodPage = async (req, res, next) => {
    try {
        // Get available food items
        const foodItems = await FoodItem.find({ is_available: true }).sort('name');

        // Get active categories (for navigation bar in food.ejs)
        const categories = await FoodCategory.find({ is_active: true }).sort('display_order');

        // NOW: send both foodItems AND categories to your EJS template.
        console.log('Categories fetched:', categories);
        console.log('Food items fetched:', foodItems);
        res.render('food', { foodItems, categories, currentPage: 'food' });
    } catch (error) {
        next(error);
    }
};



// da b view el menu b API call
exports.getFoodMenu = async (req, res) => {
    try {
        const menu = await FoodCategory.aggregate([ 
            { $match: { is_active: true } },
            { $sort: { display_order: 1 } },
            {
                $lookup: {
                    from: 'fooditems',
                    localField: '_id',
                    foreignField: 'category_id',
                    as: 'items',
                    pipeline: [{ $match: { is_available: true } }]
                }
            }
        ]);
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the food menu' });
    }
};

//same for categories
exports.getFoodCategories = async (req, res) => {
    try {
        const categories = await FoodCategory.find({ is_active: true }).sort('display_order');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch food categories' });
    }
};

// function bt create  food order from the checkout modal.
exports.createFoodOrder = async (req, res, next) => {
    try {
        const { items, total_amount, payment_method } = req.body; //data sent from user
        const userId = req.user?.id; //3shan ashof el login status

        if (!userId) { //handling cart 
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Your cart is empty' });
        }

        const newOrder = new FoodOrder({
            user_id: userId,
            items: items,
            total_amount,
            payment_method,
            status: payment_method === 'card' ? 'confirmed' : 'pending',
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: 'Order created successfully!',
            orderReference: savedOrder.order_reference,
            totalPaid: savedOrder.total_amount
        });
    } catch (error) {
        next(error);
    }
};
