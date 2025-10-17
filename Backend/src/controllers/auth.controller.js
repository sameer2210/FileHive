import dotenv from 'dotenv';
import redisClient from '../config/redis.js';
import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
dotenv.config();

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    // Store session in Redis for 1 hour (3600 seconds)
    await redisClient.set(`session:${user._id}`, token, { EX: 3600 });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (e) {
    next(e);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    await redisClient.set(`session:${user._id}`, token, { EX: 3600 });

    res.json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (e) {
    next(e);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const userId = req.user;
    if (!userId) return res.status(400).json({ message: 'No user ID' });

    await redisClient.del(`session:${userId}`);
    res.json({ message: 'Logged out successfully' });
  } catch (e) {
    next(e);
  }
};

//if not use Redis then remove from local Storage--------------------------------
// export const logoutUser = async (req, res, next) => {
//   try {
//     // Clear the JWT cookie if using cookies
//     res.cookie('JWT', '', {
//       httpOnly: true,
//       expires: new Date(0),
//       sameSite: 'strict',
//       secure: process.env.NODE_ENV === 'production',
//     });
//     return res.status(200).json({ message: 'Logged out successfully' });
//   } catch (e) {
//     next(e);
//   }
// };
