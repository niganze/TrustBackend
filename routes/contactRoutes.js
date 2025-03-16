import express from 'express';
import { 
  submitContact, 
  getContacts, 
  getContact, 
  updateContactStatus, 
  deleteContact 
} from '../controllers/contactController.js';

const router = express.Router();

// Public route
router.post('/', submitContact);



router.get('/', getContacts);
router.get('/:id', getContact);
router.put('/:id', updateContactStatus);
router.delete('/:id', deleteContact);

export default router;