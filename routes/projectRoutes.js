import express from 'express';
import { uploadSingleCloud, uploadMultipleCloud } from '../middleware/multerCloudinary.js'; // Import Cloudinary upload middleware
import { createProject } from '../controllers/projectController.js';

const router = express.Router();

// POST Route to create a new project
router.post(
  '/',
  uploadSingleCloud('image'),  // For a single main image upload
  uploadMultipleCloud('images', 5),  // For uploading multiple images (up to 5)
  createProject
);

export default router;
