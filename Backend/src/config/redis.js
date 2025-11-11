// src/config/redis.js

import { createClient } from 'redis';

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

// console.log(
//   'ENV sammer',
//   process.env.REDIS_HOST,
//   process.env.REDIS_PORT,
//   process.env.REDIS_PASSWORD
// );

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
