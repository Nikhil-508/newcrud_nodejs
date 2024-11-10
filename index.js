const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userRouter = require('./Routes/userRouter')
const app = express()


app.use(express.json());


const PORT = process.env.port
const mongouri = process.env.mongourl


app.use('/users',userRouter)

app.listen(PORT,() => {
    console.log(`server is running on  ${PORT}`)
})

mongoose.connect(mongouri)
.then(() => console.log('db connected'))
.catch((err) => console.log("db errorr",err))


