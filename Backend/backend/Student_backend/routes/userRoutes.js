import express from "express";
import { uploadUser} from "../controllers/userController.js";
import fileUpload from "express-fileupload";

const router = express.Router();
router.use(fileUpload({ useTempFiles: true }));

router.post("/upload", uploadUser);


export default router;
