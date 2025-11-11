import './src/config/env.js';
import './src/config/redis.js';
import connectDB from './src/config/db.js';
import http from 'http';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

startServer();
