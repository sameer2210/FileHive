// import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';
// dotenv.config();

// export const protect = async (req, res, next) => {
//   try {
//     const auth = req.headers.authorization || '';
//     const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
//     if (!token) return res.status(401).json({ message: 'Not authorized' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) return res.status(401).json({ message: 'User not found' });

//     req.user = user;
//     next();
//   } catch (e) {
//     res.status(401).json({ message: 'Token invalid' });
//   }
// };

// if apply radis store and verify token in radis-------------------------------------------------------

import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import dotenv from 'dotenv';
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

    req.user = decoded.id;
    next();
  } catch (e) {
    console.error('Protect error:', e.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
