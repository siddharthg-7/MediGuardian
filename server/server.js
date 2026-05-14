import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { firebaseAdmin } from './firebase/admin.js';
import medicationRoutes from './routes/medication.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 MediGuardian Server running on port ${PORT}`);
});
