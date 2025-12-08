import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./middleware/auth.js";
import "dotenv/config";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  console.log("test");
  res.json({ message: "✅ Serveur fonctionne !" });
});

app.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message, errors: error.errors });
  }
});

app.post("/logIn", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Wrong email or password" });
    }
    if (user.password !== req.body.password) {
      return res.status(401).json({ message: "Wrong email or password" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      message: "Successfull login",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, errors: error.errors });
  }
});

app.get("/users", authenticateToken, async (req, res) => {
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

app.get("/myUser", authenticateToken, async (req, res) => {
  // console.log("hi");
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

app.put("/update", authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.password === "") {
      return res
        .status(401)
        .json({ message: "You need to enter your password to allow changes" });
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

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
