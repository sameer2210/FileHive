// // src/config/redis.js
// import { createClient } from 'redis';

// const redisClient = createClient({
//   username: 'default',
//   password: 'MzM93X1G41VP16Png46yUQxoWxOfBruj',
//   socket: {
//     host: 'redis-17550.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
//     port: 17550,
//   },
// });

// redisClient.on('error', err => console.error('Redis Client Error', err));
// redisClient.on('connect', () => console.log('Redis connected'));

// await redisClient.connect();

// export default redisClient;








// src/config/redis.js
import { createClient } from 'redis';

const redisClient = createClient({
  username: 'default',
  password: 'MzM93X1G41VP16Png46yUQxoWxOfBruj',
  socket: {
    host: 'redis-17550.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 17550,
  },
});

redisClient.on('error', err => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis connected successfully'));

// Connect safely
const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

connectRedis();

export default redisClient;
