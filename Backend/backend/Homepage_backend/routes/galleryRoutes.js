
import express from 'express';
import GalleryItem from '../models/Gallery/GalleryItem.js';

const router = express.Router();


// GET all gallery items
router.get('/', async (req, res) => {
  try {
    const galleryItems = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
