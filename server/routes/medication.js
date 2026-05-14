import express from 'express';
import { 
  getMedications, 
  addMedication, 
  updateMedication, 
  deleteMedication 
} from '../controllers/medicationController.js';

const router = express.Router();

router.get('/', getMedications);
router.post('/', addMedication);
router.put('/:id', updateMedication);
router.delete('/:id', deleteMedication);

export default router;
