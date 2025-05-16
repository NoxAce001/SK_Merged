import express from 'express';
import Marquee from '../../Homepage_backend/models/MarqueeLine/marquee.model.js';

const router = express.Router();

// Get all marquees
router.get('/', async (req, res) => {
  try {
    const marquees = await Marquee.find().sort({ createdAt: -1 });
    res.json(marquees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get active marquees
router.get('/active', async (req, res) => {
  try {
    const marquees = await Marquee.find({ isActive: true });
    res.json(marquees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


export default router;
