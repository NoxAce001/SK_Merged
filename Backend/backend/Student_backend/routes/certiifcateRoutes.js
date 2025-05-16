import express from "express";
import { requestCertificate, getCertificates, updateCertificateStatus } from "../controllers/certificateController.js";

const router = express.Router();

router.post("/:id/request-certificate", requestCertificate);
router.get("/", getCertificates);
router.put("/:id/status", updateCertificateStatus);

export default router;
