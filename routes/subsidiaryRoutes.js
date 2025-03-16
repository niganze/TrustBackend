import express from 'express';
import {
  createSubsidiary,
  getAllSubsidiaries,
  getSubsidiaryById,
  updateSubsidiary,
  deleteSubsidiary,
} from '../controllers/subsidiaryController.js';
import { uploadSingleCloud } from '../middleware/multerCloudinary.js'; // Cloudinary upload middleware

const router = express.Router();

// Routes for Subsidiaries
router
  .route('/')
  .get(getAllSubsidiaries)  // Get all subsidiaries
  .post(uploadSingleCloud('logoImage'), createSubsidiary);  // Post a new subsidiary with logo image

router
  .route('/:id')
  .get(getSubsidiaryById)  // Get a specific subsidiary by ID
  .put(uploadSingleCloud('logoImage'), updateSubsidiary)  // Update subsidiary with logo image
  .delete(deleteSubsidiary);  // Delete subsidiary

export default router;
