import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const uploadUser = async (req, res) => {
  try {
    // ✅ Fix: Check if `req.files` exists
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const file = req.files.image;
    console.log("File received:", file); // ✅ Debugging log

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath);

    const newUser = new User({
      name: req.body.name,
      imageUrl: result.secure_url,
    });

    await newUser.save();
    res.json({ message: "User created!", user: newUser });
  } catch (error) {
    console.error("Upload error:", error); // ✅ Debug log
    res.status(500).json({ error: error.message });
  }
};
