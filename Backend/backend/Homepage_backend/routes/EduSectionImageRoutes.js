
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const { uploadImage } = require("../controllers/uploadController");
// const {getRecentStudents,getRecentCenterImgs} = require("../controllers/EducationSection.controller")

// const upload = multer({ storage: multer.memoryStorage() });

// router.post("/upload", upload.single("Image"), uploadImage);
// router.get("/recentStudentImg" , getRecentStudents)
// router.get("/recentCenterImg",getRecentCenterImgs)
// module.exports = router;
import express from "express";
// import multer from "multer";
// import { uploadImage } from "../controllers/uploadController.js";
import { getRecentStudents, getRecentCenterImgs } from "../controllers/EducationSection.controller.js";

const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// router.post("/upload", upload.single("Image"), uploadImage);
router.get("/recentStudentImg", getRecentStudents);
router.get("/recentCenterImg", getRecentCenterImgs);

export default router;
