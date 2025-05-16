// server/routes/MainSlider/mainSlider.routes.js
import express from 'express';
import mainSliderController from '../../controllers/MainSlider/mainSlider.controller.js';

const router = express.Router();

// Public route - Get published images only (for frontend display)
router.get('/published', mainSliderController.getPublishedImages);

// Admin routes
// Get all images (published and unpublished)
router.get('/', mainSliderController.getAllImages);

// Upload images to temporary storage
router.post(
  '/upload', 
  mainSliderController.uploadImages, 
  mainSliderController.handleUploadErrors,
  mainSliderController.validateAndStoreImages
);

// Publish images with upload to Cloudinary
router.post('/publish-with-upload', mainSliderController.publishWithUpload);

// Update existing images to published status
router.put('/publish', mainSliderController.publishImages);

// Reorder images
router.put('/reorder', mainSliderController.reorderImages);

// Delete an image
router.delete('/:id', mainSliderController.deleteImage);

// Clean up temporary files
router.post('/cleanup-temp', mainSliderController.cleanupTempImages);

export default router;

// // server/routes/MainSlider/mainSlider.routes.js
// import express from 'express';
// import mainSliderController from '../../controllers/MainSlider/mainSlider.controller.js';
// import { isAdmin } from '../../middleware/auth.middleware.js'; // Assuming you have auth middleware

// const router = express.Router();

// // Public route - Get published images only (for frontend display)
// router.get('/published', mainSliderController.getPublishedImages);

// // Admin routes - Protected by isAdmin middleware
// // Get all images (published and unpublished)
// router.get('/', isAdmin, mainSliderController.getAllImages);

// // Upload images to temporary storage
// router.post(
//   '/upload', 
//   isAdmin, 
//   mainSliderController.uploadImages, 
//   mainSliderController.handleUploadErrors,
//   mainSliderController.validateAndStoreImages
// );

// // Publish images with upload to Cloudinary
// router.post('/publish-with-upload', isAdmin, mainSliderController.publishWithUpload);

// // Update existing images to published status
// router.put('/publish', isAdmin, mainSliderController.publishImages);

// // Reorder images
// router.put('/reorder', isAdmin, mainSliderController.reorderImages);

// // Delete an image
// router.delete('/:id', isAdmin, mainSliderController.deleteImage);

// // Clean up temporary files
// router.post('/cleanup-temp', isAdmin, mainSliderController.cleanupTempImages);

// export default router;



// // server/routes/sliderRoutes.js (ESM version)
// import express from 'express';
// import sliderImageController from '../../controllers/MainSlider/mainSlider.controller.js';

// const router = express.Router();

// // Get all slider images (admin)
// router.get('/slider-images', sliderImageController.getAllImages);

// // Get published slider images (client)
// router.get('/slider-images/published', sliderImageController.getPublishedImages);

// // Upload images
// router.post(
//   '/slider-images/upload',
//   sliderImageController.uploadImages,
//   sliderImageController.handleUploadErrors,
//   sliderImageController.uploadToCloudinary
// );

// // Delete image
// router.delete('/slider-images/:id', sliderImageController.deleteImage);

// // Reorder images
// router.put('/slider-images/reorder', sliderImageController.reorderImages);

// // Publish all images
// router.post('/slider-images/publish', sliderImageController.publishImages);

// export default router;
