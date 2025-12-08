import { request } from "express";
import mongoose from "mongoose";

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
  name: {
    type: String,
    required: false,
    trim: true,
  },
  surname: {
    type: String,
    required: false,
    trim: true,
  },
  bio: {
    type: String,
    required: false,
  },
  profileIcon_id: {
    type: Number,
    request: false,
  },
});

export const User = mongoose.model("User", userSchema);
