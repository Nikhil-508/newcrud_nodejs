const express = require('express')
const { register, addProduct, order, getAllUsers, insights } = require('../Controller/userController')

const router = express.Router()

router.post('/register',register)
router.post('/add-product',addProduct)
router.post('/create-order',order)
router.get('/get-All-Users',getAllUsers)
router.get('/insights',insights)



module.exports = router