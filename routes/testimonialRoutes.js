import express from 'express';
import { 
  getTestimonials, 
  getTestimonial, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../controllers/testimonialController.js';
import { uploadSingleCloud } from '../middleware/multerCloudinary.js';


const router = express.Router();

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

router.post('/', uploadSingleCloud('image'), createTestimonial);
router.put('/:id', uploadSingleCloud('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;