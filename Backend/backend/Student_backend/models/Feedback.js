import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: {type: String, required:true},
    rollNumber: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);


const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

export default Feedback;
