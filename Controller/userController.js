const userModel = require("../Model/userModel");
const productModel = require('../Model/productModel');
const orderModel = require("../Model/orderModel");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new userModel({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log('register error', error);
        res.status(500).json({ message: "An error occurred during registration" });
    }
};

const addProduct = async(req,res) => {
    try {
        const product = new productModel(req.body)
        await product.save()
        res.status(201).json({message : "product added successfully"})
    } catch (error) {
        res.status(500).json({message : "error creating product",error})
    }
}

const order = async (req,res) => {
    try {
        const order = new orderModel(req.body)
        await order.save()
        res.status(201).json({message :"order succudfull"})
    } catch (error) {
        res.status(500).json({message : "order creation error"})
    }
}

const getinsights = async(req,res) => {
    try {
        const {startDate,endDate} = req.query
        const start = new Date(startDate)
        const end = new Date(endDate)

        if(!start || !end){
            return res.status(400).json({message : "invalid date range"})
        }
        const totalOrders = await orderModel.countDocuments({
            orderDate: {$gte : start, $lte : end}
        })

        const revenueByCategory = await orderModel.aggregate([
            {$mat}
        ])
    } catch (error) {
        res.status(500).json({message : ""})
    }
}

const getAllUsers = async(req,res) => {
    try {
        const users = await userModel.find()
        res.status(201).json({message :"usersss",users})
    } catch (error) {
        res.status(500).json({message : "user getting error"})
    }
}

const insights = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = new Date(startDate);
        const end = new Date(endDate);


        if (!start || !end) {
            return res.status(400).json({ message: 'Invalid date range' });
        }

        const totalOrders = await orderModel.countDocuments({
            orderDate: { $gte: start, $lte: end }
        });

        const revenueByCategory = await orderModel.aggregate([
            { $match: { orderDate: { $gte: start, $lte: end } } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $group: {
                    _id: '$productInfo.category',
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            }
        ]);

        const topProducts = await orderModel.aggregate([
            { $match: { orderDate: { $gte: start, $lte: end } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalUnitsSold: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalUnitsSold: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    name: '$productInfo.name',
                    totalUnitsSold: 1
                }
            }
        ]);

        const totalRevenue = await orderModel.aggregate([
            { $match: { orderDate: { $gte: start, $lte: end } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);

        const totalUsers = await userModel.countDocuments();
        
        const avgRevenuePerUser = totalUsers > 0 ? totalRevenue[0].totalRevenue / totalUsers : 0;

        res.json({
            totalOrders,
            revenueByCategory,
            topProducts,
            avgRevenuePerUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching insights', error });
    }
}



module.exports = { register,addProduct,order,getAllUsers,insights };
