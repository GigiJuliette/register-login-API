import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/allUsers", async (_req, res) => {
  try {
    const allUsers = await User.find();

    const userSafe = allUsers.map((u) => {
      const user = u.toObject();
      delete user.password;
      delete user._id;
      delete user.__v;

      return user;
    });

    res.json(userSafe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      req.body,
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const userSafe = updatedUser.toObject();
    delete userSafe.password;
    delete userSafe._id;
    delete userSafe.__v;

    res.json(userSafe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/myUser", async (req, res) => {
  try {
    const myUser = await User.findById(req.user.userId);
    const userSafe = myUser.toObject();
    delete userSafe.password;
    delete userSafe._id;
    delete userSafe.__v;
    res.json(userSafe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
