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
import otpRoutes from './routes/otp.routes.js';

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow both local and deployed frontends - filter out undefined FRONTEND_URL
const allowedOrigins = [
  'http://localhost:5173', // Local dev frontend
  process.env.FRONTEND_URL, // Vercel frontend from env (set in Render dashboard)
].filter(Boolean); // Removes undefined/empty values

// Log for debugging (check Render logs)
console.log('Allowed origins:', allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman or curl (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Deny with error only (no second arg, per cors docs)
      return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.get('/', (req, res) => res.json({ message: 'API running' }));
app.get('/api/health', (req, res) => {
res.status(200).json({status:'ok',  message: 'backend ' });
})

app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/otp', otpRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
