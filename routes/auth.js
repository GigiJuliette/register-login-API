import express from "express";
import jwt from "jsonwebtoken";

import {
  comparePassword,
  hashPassword,
} from "../middleware/passwordsMethods.js";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const userSafe = user.toObject();
    delete userSafe.password;
    delete userSafe._id;
    delete userSafe.__v;

    res.status(201).json(userSafe);
  } catch (error) {
    res.status(400).json({ message: error.message, errors: error.errors });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isCorrect = await comparePassword(req.body.password, user.password);

    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
    res.json({
      message: "Successfull login",
      token: token,
    });
  } catch (_error) {
    res.status(500).json({ message: "An error has occurred" });
  }
});

export default router;
