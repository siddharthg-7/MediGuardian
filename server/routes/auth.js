import express from 'express';
import { auth } from '../firebase/admin.js';

const router = express.Router();

// Get current user profile (synced from Firebase)
router.get('/profile', async (req, res) => {
  // In a real app, verifyToken middleware would be here
  res.status(200).json({ message: 'Auth profile endpoint' });
});

export default router;
