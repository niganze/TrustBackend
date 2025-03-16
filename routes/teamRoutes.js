// routes/teamRoutes.js
import express from 'express';

import { 
  getTeamMembers, 
  getTeamMember, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember 
} from '../controllers/teamController.js';
import { uploadSingleCloud } from '../middleware/multerCloudinary.js';

const router = express.Router();

// Debug middleware
const debugMiddleware = (req, res, next) => {
  console.log('Debug - Headers:', req.headers);
  console.log('Debug - Content-Type:', req.headers['content-type']);
  console.log('Debug - Request Body:', req.body);
  next();
};

// Routes using the upload middleware
router
  .route('/')
  .get(getTeamMembers)
  .post(
    debugMiddleware,
    uploadSingleCloud('image', 'team/profiles'), 
    createTeamMember
  ); 

router
  .route('/:id')
  .get(getTeamMember)
  .put(
    debugMiddleware,
    uploadSingleCloud('image', 'team/profiles'), 
    updateTeamMember
  )   
  .delete(deleteTeamMember);

export default router;