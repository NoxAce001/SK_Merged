import express from "express";
import { submitFeedback,
    getFeedbackByStudent,
    updateFeedback,
    deleteFeedback, } from "../controllers/FeedbackController.js";

    const router = express.Router();

    // Create feedback
    router.post("/", submitFeedback);
    
    // Get feedback for a student
    router.get("/:studentId", getFeedbackByStudent);
    
    // Update feedback
    router.put("/:id", updateFeedback);
    
    // Delete feedback
    router.delete("/:id", deleteFeedback);
    
    export default router;
