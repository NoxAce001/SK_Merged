import express from "express";
import { getAllFeedbacks } from "../controllers/FeedbackController.js";

const router = express.Router();

router.get("/feedbacks", getAllFeedbacks);

export default router;
