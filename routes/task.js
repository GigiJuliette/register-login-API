import express from "express";
import { Task } from "../models/Task.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task._id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.body);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
