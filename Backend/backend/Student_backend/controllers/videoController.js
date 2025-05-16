import Video from "../models/Video.js";

// ✅ Fetch videos by course
export const getVideosByCourse = async (req, res) => {
  try {
    const { course } = req.params;
    if (!course) return res.status(400).json({ message: "Course is required!" });

    const videos = await Video.find({ course }).sort({ createdAt: -1 }); // ✅ Sort latest first
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Server error" });
  }
};
