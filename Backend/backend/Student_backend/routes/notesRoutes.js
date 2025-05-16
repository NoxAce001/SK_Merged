import express from "express";
import { getNotesByCourse } from "../controllers/notesController.js";

const router = express.Router();

// Route to get notes by course
router.get("/:course", getNotesByCourse);

export default router;
