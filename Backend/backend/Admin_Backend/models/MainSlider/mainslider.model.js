
import mongoose from 'mongoose';

const sliderImageSchema = new mongoose.Schema({
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

// Always sort by order when retrieving
sliderImageSchema.pre('find', function() {
  this.sort({ order: 1 });
});

const SliderImage = mongoose.model('SliderImage', sliderImageSchema);

export default SliderImage;
