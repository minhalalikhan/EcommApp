const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures each username is unique
        trim: true // Removes extra whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures each email is unique
        trim: true,
        lowercase: true, // Converts email to lowercase
        match: [/.+@.+\..+/, 'Please enter a valid email'] // Simple regex for basic email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Ensures a minimum length for password
    }
}, { timestamps: true }); // Adds `createdAt` and `updatedAt` fields

const User = mongoose.model('User', userSchema);


// Define a schema for the Product
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, },
    id: { type: Number, required: true, },
    keyword: { type: String, required: true },
    seller: { type: String, required: true },
    short_desc: { type: String, required: true },
    long_desc: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    limited_stock: { type: Boolean, default: false },
    best_seller: { type: Boolean, default: false },
    new_arrival: { type: Boolean, default: false },
}, { timestamps: true });

// Create the Product model
const Product = mongoose.model('Product', productSchema);


const cartSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        itemSubtotal: { type: Number, required: true, min: 1 }
    }],
    cartSize: { type: Number, default: 0 }, // Total count of items in cart
    subtotal: { type: Number, default: 0 }, // Sum of all product prices * quantity
    charges: { type: Number, default: 100 }, // Additional fees like shipping
}, { timestamps: true });


const Cart = mongoose.model('Cart', cartSchema);



const orderSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        itemSubtotal: { type: Number, required: true, min: 1 }
    }],
    orderSize: { type: Number, default: 0 }, // Total count of items in order
    subtotal: { type: Number, default: 0 }, // Total before charges
    charges: { type: Number, default: 100 }, // Additional fees like shipping
    totalPrice: { type: Number, default: 0 }, // subtotal + charges
}, { timestamps: true });



const Order = mongoose.model('Order', orderSchema);

module.exports = { User, Product, Cart, Order }