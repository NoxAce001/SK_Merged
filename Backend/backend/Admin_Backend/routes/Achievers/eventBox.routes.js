import express from 'express';
import eventBoxController from '../../controllers/Achievers/eventBox.controller.js';

const router = express.Router();

// Public route - Get published images only (for frontend display)
router.get('/published', eventBoxController.getPublishedImages);

// Admin routes
// Get all images (published and unpublished)
router.get('/', eventBoxController.getAllImages);

// Upload images to temporary storage
router.post(
  '/upload', 
  eventBoxController.uploadImages, 
  eventBoxController.handleUploadErrors,
  eventBoxController.validateAndStoreImages
);

// Publish images with upload to Cloudinary
router.post('/publish-with-upload', eventBoxController.publishWithUpload);

// Update existing images to published status
router.put('/publish', eventBoxController.publishImages);

// Reorder images
router.put('/reorder', eventBoxController.reorderImages);

// Delete an image
router.delete('/:id', eventBoxController.deleteImage);

// Clean up temporary files
router.post('/cleanup-temp', eventBoxController.cleanupTempImages);

export default router;