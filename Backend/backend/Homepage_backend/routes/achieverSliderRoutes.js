import express from 'express';
import { 
  getAchievementsForLandingPage
  // getFeaturedAchievements (optional)
} from '../controllers/AchieverSliderController.js';

const router = express.Router();

// Route: GET /api/achievements/landing-slider
router.get('/', getAchievementsForLandingPage);

// Optional route if you add featured achievements later
// router.get('/featured', getFeaturedAchievements);

export default router;
