import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
dotenv.config();

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token exists in Redis
    const storedToken = await redisClient.get(`session:${decoded.id}`);
    if (!storedToken) {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }

    if (storedToken !== token) {
      return res.status(401).json({ message: 'Invalid session token' });
    }

    // req.user = decoded.id;
    req.user = { _id: decoded.id };
    next();
  } catch (e) {
    console.error('Protect error:', e.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
