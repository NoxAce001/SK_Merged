import express from "express";
import { getVideosByCourse } from "../controllers/videoController.js";

const router = express.Router();

// ✅ Route to get videos by course
router.get("/:course", getVideosByCourse);

export default router;
