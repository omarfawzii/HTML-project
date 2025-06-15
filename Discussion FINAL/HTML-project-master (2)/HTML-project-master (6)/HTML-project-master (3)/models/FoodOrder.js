const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

// schema for 1 order
const orderItemSchema = new mongoose.Schema({
    food_item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price_at_order: {
        type: Number,
        required: true
    }
}, { _id: false }); // _id is not needed for sub-documents here

const foodOrderSchema = new mongoose.Schema({  //el order el kbyr
    order_reference: {
        type: String,
        required: true,
        unique: true    
    }, 
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    booking_id: {   //link to a movie booking //msh shaghal
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking' 
    },
    items: [orderItemSchema], // Array lel ordered items
    total_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    payment_method: {
        type: String,
        enum: ['card', 'cash', 'online', 'none'],
        required: true
    },
    special_requests: String
}, { timestamps: true });

// Before a new order is saved, create a unique reference number 
foodOrderSchema.pre('validate', function(next) {
    if (this.isNew) {
        // Generates a friendly, unique order reference like 'VOX-F4D9K1'
        const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
        this.order_reference = `VOX-F${nanoid()}`;
    }
    next();
});