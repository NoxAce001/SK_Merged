// routes/achievementRoutes.js
import express from 'express';
const router = express.Router();

import {
  addAchievement,
//   updateAchievement,
  deleteAchievement,
//   hardDeleteAchievement,
  getAllAchievements,
//   getAchievementById,
//   getAchievementsByRollNumber
} from '../../controllers/Achievers/achievementController.js';

// Routes for super admin only - protected
router.post('/',  addAchievement);
// router.put('/:id', authenticateSuperAdmin, updateAchievement);
router.delete('/:id', deleteAchievement);
// router.delete('/permanent/:id', authenticateSuperAdmin, hardDeleteAchievement);

// Routes accessible by both admin and public
router.get('/', getAllAchievements);
// router.get('/:id', getAchievementById);
// router.get('/student/:rollNumber', getAchievementsByRollNumber);

export default router;
