import express from 'express';
import { createProject } from '../controllers/projectController.js';
import { uploadMultipleCloud } from '../middleware/multerCloudinary.js';

const router = express.Router();

router.post('/', 
  uploadMultipleCloud({
    fields: ['image', 'gallery'],
    maxCount: 10,
    folder: 'projects'
  }), 
  createProject
);

export default router;
