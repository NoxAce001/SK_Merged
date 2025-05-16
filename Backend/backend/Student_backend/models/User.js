import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
});

export default mongoose.model("User", userSchema);

