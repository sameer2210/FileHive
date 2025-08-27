import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { errorHandler, notFound } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import folderRoutes from './routes/folder.routes.js';
import imageRoutes from './routes/image.routes.js';

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL, // Vercel frontend
  'http://localhost:5173', // Local dev frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
  })
);

// app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));

app.get('/', (req, res) => res.json({ message: 'API running' }));

app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
