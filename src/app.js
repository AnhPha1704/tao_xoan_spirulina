import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { initCronJobs } from './services/cronService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import definitionRoutes from './routes/definitionRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Swagger Documentation
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(express.json());

// Serve static frontend from /public folder
app.use(express.static(path.join(__dirname, '../public')));

// Mount API routes
app.use('/api/Sensors', definitionRoutes);
app.use('/api/Sensors', recordRoutes);
app.use('/api/auth', authRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Fallback: serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Khởi động các Cron Jobs ngầm
    initCronJobs();
});