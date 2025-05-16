import mongoose from 'mongoose';

const MarqueeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    enum: ['top', 'bottom'],
    default: 'top'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Marquee = mongoose.model('Marquee', MarqueeSchema);
export default Marquee;
