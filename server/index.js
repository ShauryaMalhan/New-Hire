import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Config
import connectDB from './config/db.js';

// Import Routes
import taskRoutes from './routes/taskRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js'; // <-- Import new route

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes); // <-- Use new route

app.get('/', (req, res) => {
  res.send('NexBoard API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});