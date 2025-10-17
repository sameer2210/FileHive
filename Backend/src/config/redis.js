// src/config/redis.js
import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config();

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on('error', err => console.error(' Redis Client Error:', err));
redisClient.on('connect', () => console.log(' Redis connected successfully'));

// Connect safely
const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

connectRedis();

export default redisClient;
