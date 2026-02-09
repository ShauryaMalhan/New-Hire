import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true
  },
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed'],
    default: 'pending' 
  },
  icon: { 
    type: String, 
    required: true 
  }
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;