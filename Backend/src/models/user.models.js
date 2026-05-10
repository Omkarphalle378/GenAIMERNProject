const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "username is required"],
    trim: true
  },

  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: [true, "password is required"]
  }
})

const userModel = mongoose.model("users",userSchema)

module.exports = userModel;