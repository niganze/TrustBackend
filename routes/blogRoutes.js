import express from 'express';
import { 
  getBlogPosts, 
  getBlogPost, 
  
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost 
} from '../controllers/blogController.js';
import { uploadSingleCloud } from '../middleware/multerCloudinary.js';



const router = express.Router();
// Public routes
router.get('/', getBlogPosts);

router.get('/:id', getBlogPost);


router.post('/', uploadSingleCloud('image'), createBlogPost);
router.put('/:id', uploadSingleCloud('image'), updateBlogPost);
router.delete('/:id', deleteBlogPost);

export default router;