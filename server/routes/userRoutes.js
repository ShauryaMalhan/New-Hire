import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js'; // <--- IMPORT THIS

const router = express.Router();

// Add 'protect' as the second argument
router.get('/profile', protect, async (req, res) => {
  // Now req.user will exist!
  const user = await User.findById(req.user._id);
  res.json(user);
});

export default router;