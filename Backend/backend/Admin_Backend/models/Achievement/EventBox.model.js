
import mongoose from 'mongoose';

const EventBoxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

const EventBox = mongoose.model('EventBox', EventBoxSchema);

export default EventBox;
