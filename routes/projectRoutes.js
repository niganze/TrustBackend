import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';

import { uploadMultipleCloud } from '../middleware/multerCloudinary.js';

const router = express.Router();

// Upload fields config (adjust maxCount if necessary)
const uploadFields = uploadMultipleCloud({
  fields: ['image', 'gallery'],
  maxCount: 10,
  folder: 'projects',
});

// Create Project
router.post('/', uploadFields, createProject);

// Get All Projects
router.get('/', getAllProjects);

// Get Single Project
router.get('/:id', getProjectById);

// Update Project
router.put('/:id', uploadFields, updateProject);

// Delete Project
router.delete('/:id', deleteProject);

export default router;
