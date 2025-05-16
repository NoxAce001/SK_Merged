// server/controllers/MainSlider/mainSlider.controller.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
// import path from 'path';
import SliderImage from '../../models/MainSlider/mainslider.model.js';

import dotenv from 'dotenv';
dotenv.config();
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'temp-uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadImages = upload.array('images', 10);

const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
  next();
};

const getAllImages = async (req, res) => {
  try {
    const images = await SliderImage.find().sort({ order: 1 });
    res.json(images);
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ message: 'Server error, could not fetch images' });
  }
};

const getPublishedImages = async (req, res) => {
  try {
    const images = await SliderImage.find({ isPublished: true }).sort({ order: 1 });
    res.json(images);
  } catch (error) {
    console.error('Error getting published images:', error);
    res.status(500).json({ message: 'Server error, could not fetch published images' });
  }
};

// This function now simply validates and stores files temporarily
const validateAndStoreImages = async (req, res) => {
  try {
    const existingCount = await SliderImage.countDocuments();

    if (existingCount + req.files.length > 10) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
      return res.status(400).json({ message: 'Cannot upload more than 10 images in total' });
    }

    // Return the file information without uploading to Cloudinary
    const tempImages = req.files.map((file, index) => ({
      name: file.originalname,
      path: file.path,
      size: file.size,
      tempOrder: existingCount + index
    }));

    res.status(200).json({ tempImages, message: 'Images selected successfully' });
  } catch (error) {
    console.error('Error processing selected images:', error);

    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({ message: 'Failed to process selected images' });
  }
};

// New function to publish images with upload to Cloudinary
const publishWithUpload = async (req, res) => {
  try {
    const { tempImages } = req.body;
    
    if (!tempImages || !Array.isArray(tempImages) || tempImages.length === 0) {
      return res.status(400).json({ message: 'No images to publish' });
    }

    const existingCount = await SliderImage.countDocuments();
    
    // Validate files still exist
    for (const image of tempImages) {
      if (!fs.existsSync(image.path)) {
        return res.status(400).json({ 
          message: `Temporary file ${image.name} not found. Please select images again.` 
        });
      }
    }

    // Upload to Cloudinary and save to database
    console.log("tempImages" , tempImages)
    console.log("env key " , process.env.CLOUDINARY_API_KEY)
    const uploadPromises = tempImages.map(async (image, index) => {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: 'main-slider',
        resource_type: 'image'
      });    
      fs.unlinkSync(image.path);

      return new SliderImage({
        name: image.name,
        url: result.secure_url,
        cloudinaryId: result.public_id,
        size: image.size,
        order: existingCount + index,
        isPublished: true
      });
    });

    const newImages = await Promise.all(uploadPromises);
    await SliderImage.insertMany(newImages);

    const allImages = await SliderImage.find().sort({ order: 1 });
    res.status(201).json({ allImages, message: 'Images published successfully' });
  } catch (error) {
    console.error('Error publishing images:', error);
    
    // Clean up any remaining temp files
    if (req.body.tempImages) {
      req.body.tempImages.forEach(image => {
        if (fs.existsSync(image.path)) {
          fs.unlinkSync(image.path);
        }
      });
    }

    res.status(500).json({ message: 'Failed to publish images' });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await SliderImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await cloudinary.uploader.destroy(image.cloudinaryId);
    await SliderImage.findByIdAndDelete(req.params.id);

    const remainingImages = await SliderImage.find().sort({ order: 1 });
    const updatePromises = remainingImages.map((img, index) => {
      return SliderImage.findByIdAndUpdate(img._id, { order: index });
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error, could not delete image' });
  }
};

const reorderImages = async (req, res) => {
  try {
    const { imageId, direction } = req.body;
    const image = await SliderImage.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const adjacentImage = await SliderImage.findOne({
      order: direction === 'up' ? image.order - 1 : image.order + 1
    });

    if (!adjacentImage) {
      return res.status(400).json({ message: 'Cannot reorder in that direction' });
    }

    const tempOrder = image.order;
    image.order = adjacentImage.order;
    adjacentImage.order = tempOrder;

    await image.save();
    await adjacentImage.save();

    res.status(200).json({ message: 'Image reordered successfully' });
  } catch (error) {
    console.error('Error reordering images:', error);
    res.status(500).json({ message: 'Server error, could not reorder images' });
  }
};

// Update existing images to published status
const publishImages = async (req, res) => {
  try {
    await SliderImage.updateMany({}, { isPublished: true });
    res.status(200).json({ message: 'All images published successfully' });
  } catch (error) {
    console.error('Error publishing images:', error);
    res.status(500).json({ message: 'Server error, could not publish images' });
  }
};

// Clean up temporary images that were selected but not published
const cleanupTempImages = async (req, res) => {
  try {
    const { tempImages } = req.body;
    
    if (tempImages && Array.isArray(tempImages)) {
      tempImages.forEach(image => {
        if (fs.existsSync(image.path)) {
          fs.unlinkSync(image.path);
        }
      });
    }
    
    res.status(200).json({ message: 'Temporary images cleaned up successfully' });
  } catch (error) {
    console.error('Error cleaning up temporary images:', error);
    res.status(500).json({ message: 'Failed to clean up temporary images' });
  }
};

export default {
  uploadImages,
  handleUploadErrors,
  validateAndStoreImages,  // Renamed from uploadToCloudinary
  publishWithUpload,       // New function
  getAllImages,
  getPublishedImages,
  deleteImage,
  reorderImages,
  publishImages,
  cleanupTempImages        // New function for cleanup
};



// // server/controllers/MainSlider/mainSlider.controller.js
// import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';
// import fs from 'fs';
// // import path from 'path';
// import SliderImage from '../../models/MainSlider/mainslider.model.js';

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Configure multer for temporary file storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = 'temp-uploads';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Not an image! Please upload only images.'), false);
//   }
// };

// const upload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   }
// });

// const uploadImages = upload.array('images', 10);

// const handleUploadErrors = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ message: `Upload error: ${err.message}` });
//   } else if (err) {
//     return res.status(500).json({ message: `Server error: ${err.message}` });
//   }
//   next();
// };

// const getAllImages = async (req, res) => {
//   try {
//     const images = await SliderImage.find().sort({ order: 1 });
//     res.json(images);
//   } catch (error) {
//     console.error('Error getting images:', error);
//     res.status(500).json({ message: 'Server error, could not fetch images' });
//   }
// };

// const getPublishedImages = async (req, res) => {
//   try {
//     const images = await SliderImage.find({ isPublished: true }).sort({ order: 1 });
//     res.json(images);
//   } catch (error) {
//     console.error('Error getting published images:', error);
//     res.status(500).json({ message: 'Server error, could not fetch published images' });
//   }
// };

// const uploadToCloudinary = async (req, res) => {
//   try {
//     const existingCount = await SliderImage.countDocuments();

//     if (existingCount + req.files.length > 10) {
//       req.files.forEach(file => {
//         fs.unlinkSync(file.path);
//       });
//       return res.status(400).json({ message: 'Cannot upload more than 10 images in total' });
//     }

//     const uploadPromises = req.files.map(async (file, index) => {
//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: 'main-slider',
//         resource_type: 'image'
//       });

//       fs.unlinkSync(file.path);

//       return new SliderImage({
//         name: file.originalname,
//         url: result.secure_url,
//         cloudinaryId: result.public_id,
//         size: file.size,
//         order: existingCount + index
//       });
//     });

//     const newImages = await Promise.all(uploadPromises);
//     await SliderImage.insertMany(newImages);

//     const allImages = await SliderImage.find().sort({ order: 1 });
//     res.status(201).json(allImages);
//   } catch (error) {
//     console.error('Error uploading images:', error);

//     if (req.files) {
//       req.files.forEach(file => {
//         if (fs.existsSync(file.path)) {
//           fs.unlinkSync(file.path);
//         }
//       });
//     }

//     res.status(500).json({ message: 'Failed to upload images' });
//   }
// };

// const deleteImage = async (req, res) => {
//   try {
//     const image = await SliderImage.findById(req.params.id);

//     if (!image) {
//       return res.status(404).json({ message: 'Image not found' });
//     }

//     await cloudinary.uploader.destroy(image.cloudinaryId);
//     await SliderImage.findByIdAndDelete(req.params.id);

//     const remainingImages = await SliderImage.find().sort({ order: 1 });
//     const updatePromises = remainingImages.map((img, index) => {
//       return SliderImage.findByIdAndUpdate(img._id, { order: index });
//     });

//     await Promise.all(updatePromises);

//     res.status(200).json({ message: 'Image deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting image:', error);
//     res.status(500).json({ message: 'Server error, could not delete image' });
//   }
// };

// const reorderImages = async (req, res) => {
//   try {
//     const { imageId, direction } = req.body;
//     const image = await SliderImage.findById(imageId);

//     if (!image) {
//       return res.status(404).json({ message: 'Image not found' });
//     }

//     const adjacentImage = await SliderImage.findOne({
//       order: direction === 'up' ? image.order - 1 : image.order + 1
//     });

//     if (!adjacentImage) {
//       return res.status(400).json({ message: 'Cannot reorder in that direction' });
//     }

//     const tempOrder = image.order;
//     image.order = adjacentImage.order;
//     adjacentImage.order = tempOrder;

//     await image.save();
//     await adjacentImage.save();

//     res.status(200).json({ message: 'Image reordered successfully' });
//   } catch (error) {
//     console.error('Error reordering images:', error);
//     res.status(500).json({ message: 'Server error, could not reorder images' });
//   }
// };

// const publishImages = async (req, res) => {
//   try {
//     await SliderImage.updateMany({}, { isPublished: true });
//     res.status(200).json({ message: 'All images published successfully' });
//   } catch (error) {
//     console.error('Error publishing images:', error);
//     res.status(500).json({ message: 'Server error, could not publish images' });
//   }
// };

// export default {
//   uploadImages,
//   handleUploadErrors,
//   uploadToCloudinary,
//   getAllImages,
//   getPublishedImages,
//   deleteImage,
//   reorderImages,
//   publishImages
// };
