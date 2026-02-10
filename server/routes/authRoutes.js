import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { 
    ciscoId, fullName, email, mobile, departmentNumber, 
    role, manager, team, password 
  } = req.body;

  // 1. Validation
  if (!email.endsWith('@cisco.com')) {
    return res.status(400).json({ message: 'Registration restricted to @cisco.com emails only.' });
  }
  if (password.length < 10) {
    return res.status(400).json({ message: 'Password must be at least 10 characters long.' });
  }

  try {
    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 3. SECURITY: Hash Password with Salt + Pepper
    const pepper = process.env.PEPPER_KEY;
    const salt = await bcrypt.genSalt(10);
    // Combine password + pepper BEFORE hashing
    const hashedPassword = await bcrypt.hash(password + pepper, salt);

    // 4. Create User
    const user = await User.create({
      ciscoId, fullName, email, mobile, departmentNumber, 
      role, manager, team,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
        role: user.role
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Login User
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find User (and explicitly ask for the password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Generic error for security
    }

    // 2. SECURITY: Verify Password (Add Pepper before comparing)
    const pepper = process.env.PEPPER_KEY;
    const isMatch = await bcrypt.compare(password + pepper, user.password);

    if (isMatch) {
      // 3. Success: Send back profile info + Token
      res.json({
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        ciscoId: user.ciscoId,
        token: generateToken(user._id),
        role: user.role
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;