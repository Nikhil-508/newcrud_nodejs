const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId : mongoose.Schema.ObjectId,
    items : [
        {
            productId: mongoose.Schema.ObjectId,
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: Number,
    orderDate: {
        type : Date,
        default : Date.now()
    }
})

const orderModel = new mongoose.model('orders',orderSchema)
module.exports = orderModel