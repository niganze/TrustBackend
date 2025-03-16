import express from 'express';
import { 
  createUser, 
  deleteUser,
  
} from '../controllers/userController.js';


const router = express.Router();


router.route('/register')
  .post(createUser);

router.route('/:id')
  .delete(deleteUser);

export default router;