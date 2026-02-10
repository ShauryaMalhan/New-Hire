import express from 'express';
import Task from '../models/Task.js'; // Remember the .js extension!

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ id: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (req.body.status) {
      task.status = req.body.status;
    }
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;