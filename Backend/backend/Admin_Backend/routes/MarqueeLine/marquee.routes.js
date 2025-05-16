import express from 'express';
import Marquee from '../../models/MarqueeLine/marquee.model.js';

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

// Create new marquee
router.post('/', async (req, res) => {
  try {
    const { text, position, isActive } = req.body;

    if (isActive && position) {
      await Marquee.updateMany(
        { position: position, isActive: true },
        { $set: { isActive: false } }
      );
    }

    const newMarquee = new Marquee({
      text,
      position: position || 'top',
      isActive: isActive || false
    });

    const marquee = await newMarquee.save();
    res.json(marquee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update marquee
router.put('/:id', async (req, res) => {
  try {
    const { text, position, isActive } = req.body;

    if (isActive && position) {
      await Marquee.updateMany(
        { _id: { $ne: req.params.id }, position: position, isActive: true },
        { $set: { isActive: false } }
      );
    }

    const marquee = await Marquee.findByIdAndUpdate(
      req.params.id,
      { $set: { text, position, isActive } },
      { new: true }
    );

    if (!marquee) {
      return res.status(404).json({ msg: 'Marquee not found' });
    }

    res.json(marquee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete marquee
router.delete('/:id', async (req, res) => {
  try {
    const marqueeText = await Marquee.findById(req.params.id);

    if (!marqueeText) {
      return res.status(404).json({ msg: 'Marquee not found' });
    }
    console.log(req.params.id)
    await marqueeText.deleteOne();
    // await marquee.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Marquee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
