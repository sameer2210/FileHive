import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
dotenv.config();

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Token invalid' });
  }
};
