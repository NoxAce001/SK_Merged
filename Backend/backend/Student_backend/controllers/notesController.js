import Note from "../models/Note.js"; // Import the Note model

// Fetch notes for a specific course
export const getNotesByCourse = async (req, res) => {
  try {
    const { course } = req.params;
    const notes = await Note.find({ course }); // Find notes matching the course
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};
