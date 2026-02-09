import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  subtitle: { 
    type: String 
  },
  progress: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100
  },
  totalModules: { 
    type: Number, 
    default: 1 
  },
  required: { 
    type: Boolean, 
    default: false 
  },
  color: { 
    type: String, 
    default: 'bg-gray-100 text-gray-700' // Default styling if none provided
  }
});

const Course = mongoose.model('Course', CourseSchema);

export default Course;