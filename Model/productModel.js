const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : String,
    category : String,
    price : Number,
    stock : Number,

})

const productModel = new mongoose.model("products",productSchema)
module.exports = productModel