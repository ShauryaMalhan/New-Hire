import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { 
    ciscoId, 
    fullName, 
    email, 
    mobile,
    departmentNumber,
    role, 
    manager, 
    team 
  } = req.body;

  try {
    const userExists = await User.findOne({ ciscoId });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      ciscoId,
      fullName,
      email,
      mobile,
      departmentNumber,
      role,
      manager,
      team
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;