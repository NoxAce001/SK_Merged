import express from 'express';
import SliderImage from '../../Admin_Backend/models/MainSlider/mainslider.model.js';

const router = express.Router();



// @access  Public
router.get('/', async (req, res) => {
  try {
    const images = await SliderImage.find({ isPublished: true }); // Only published images
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching slider images:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});




// const getPublishedImages = async (req, res) => {
//   try {
//     const images = await SliderImage.find({ isPublished: true }).sort({ order: 1 });
//     res.json(images);
//   } catch (error) {
//     console.error('Error getting published images:', error);
//     res.status(500).json({ message: 'Server error, could not fetch published images' });
//   }
// };

export default router;