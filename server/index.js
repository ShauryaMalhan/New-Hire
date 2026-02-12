import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import Routes
import taskRoutes from './routes/taskRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js'; // <--- NEW

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Use Routes
app.use('/deskapp/api/tasks', taskRoutes);
app.use('/deskapp/api/courses', courseRoutes);
app.use('/deskapp/api/users', userRoutes);
app.use('/deskapp/api/auth', authRoutes); // <--- NEW

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));