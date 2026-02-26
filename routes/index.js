import express from "express";

import { authenticateToken } from "../middleware/auth.js";

import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import taskRoutes from "./task.js";
import linkRoutes from "./links.js";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/user", authenticateToken, userRoutes);
router.use("/api/task", taskRoutes);
router.use("/api/link", authenticateToken, linkRoutes);

export default router;
