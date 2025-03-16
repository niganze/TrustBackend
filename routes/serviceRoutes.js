import express from 'express';
import { 
  getServices, 
  getService, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController.js';
import { uploadSingleCloud } from '../middleware/multerCloudinary.js';


const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:id', getService);



router.post('/', uploadSingleCloud('image'), createService);
router.put('/:id', uploadSingleCloud('image'), updateService);
router.delete('/:id', deleteService);

export default router;