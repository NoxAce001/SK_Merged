// server/models/GalleryItem.js
import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export default GalleryItem;
