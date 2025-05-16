import express from "express";
import { getStudentFees } from "../controllers/feesControllers.js";

const router = express.Router();

// GET /api/v1/fees/student/:id
router.get("/student/:id", getStudentFees);

export default router;
