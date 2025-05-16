import Fees from "../models/Fees.js"

// ✅ Get fee details for a student by ID
export const getStudentFees = async (req, res) => {
  try {
    const { id } = req.params;

    const fees = await Fees.findOne({ studentId: id });

    if (!fees) {
      return res.status(404).json({ message: "No fee details found for this student." });
    }

    res.status(200).json(fees);
  } catch (error) {
    console.error("Error fetching fee details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
