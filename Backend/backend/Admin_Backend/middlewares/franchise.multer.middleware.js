import multer from "multer";
import fs from "fs";
import path from "path";

// Define the temporary directory for uploads
const tempDir = "./backend/public/temp";

// Ensure the temporary directory exists
if (!fs.existsSync(tempDir)){
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, tempDir); // Use the defined temp directory
    },
    filename: function (req, file, cb) {
      // Use a unique filename to avoid conflicts (e.g., fieldname + timestamp + originalname)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      // Keep original name structure but add unique suffix for safety
      cb(null, file.fieldname + '-' + uniqueSuffix + extension);
      // Simpler alternative (less readable): cb(null, uniqueSuffix + extension)
    }
  });

// Create the Multer upload instance
export const upload = multer({
    storage,
    // Add limits or file filters if needed
    // limits: { fileSize: 1024 * 1024 * 5 }, // Example: 5MB limit
    // fileFilter: function (req, file, cb) { ... } // Example: Check file types
});
