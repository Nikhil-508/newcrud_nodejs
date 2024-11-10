const mongoose = require('mongoose')

  const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
  })

  const userModel = new mongoose.model('userdata',userSchema)

  module.exports =  userModel