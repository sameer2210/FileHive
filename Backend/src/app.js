import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler, notFound } from '../src/middleware/error.middleware.js';

// import authRoutes from './routes/auth.routes.js';
// import userRoutes from './routes/auth.routes.js';
// import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Middleware: Logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use("/api/upload", uploadRoutes);

//test Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running ' });
});

// Error handling middleware (custom)
app.use(notFound); //404 handler
app.use(errorHandler); //general error handler

export default app;
