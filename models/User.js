const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
