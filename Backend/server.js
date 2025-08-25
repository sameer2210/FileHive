import dotenv from 'dotenv';
import http from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 5000;

const server = http.createServer(app); // Create HTTP server

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log('failed to start Server: ', err);
    process.exit(1);
  }
};

startServer();

// Gracefully handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('Un-handle Rejection: ', err);
  server.close(() => process.exit(1));
});

// handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('UnCaught Exception: ', err.message);
  process.exit(1);
});
