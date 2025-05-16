  // models/Achievement.js
import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    trim: true
  },
  achievementDetails: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Achievement = mongoose.model('Achievement', AchievementSchema);

export default Achievement;
