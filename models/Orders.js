import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    pincode: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneno: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    gotra:{
        type: String,
        required: true,
    },
    cartItems: [{
        id: String,
        productName: String,
        imgUrl: String,
        category: String,
        price: Number,
        shortDesc: String,
        description: String,
        qty: Number
    }],
    reports: [String],
      status: {
        type: String,
        default: "Pending"  
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
