import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Routes
import sensorRoutes from './routes/sensorRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(express.json());

// Mount routes
app.use('/api/Sensors', sensorRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint test
app.get('/', (req, res) => {
    res.send('Spirulina Sensors API is running...');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});