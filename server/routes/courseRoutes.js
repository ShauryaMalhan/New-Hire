import express from 'express';
import Course from '../models/Course.js'; // Remember the .js extension!

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ id: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;