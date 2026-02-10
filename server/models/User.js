import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  ciscoId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  mobile: { 
    type: String, 
    required: true
  },
  departmentNumber: { 
    type: String, 
    required: true
  },
  role: { 
    type: String, 
    default: 'New Hire'
  },
  manager: { 
    type: String, 
    required: true 
  },
  team: {
    type: String,
    default: 'Engineering'
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

export default User;