import mongoose from "mongoose";


const certificateSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    rollNumber: { type: String, required: true },
    studentName: { type: String, required: true },
    course: { type: String, required: true },
    admissionDate: { type: String, required: true },
    completionDate: { type: String },
    percentage: { type: Number },
    grade: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);

