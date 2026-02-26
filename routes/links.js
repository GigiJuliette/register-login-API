import express from "express";
import { Link } from "../models/Link.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const links = await Link.find();
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const link = await Link.create(req.body);
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedLink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const response = await Link.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
