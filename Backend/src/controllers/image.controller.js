import multer from 'multer';
import Folder from '../models/folder.model.js';
import Image from '../models/image.model.js';
import { deleteByPublicId, uploadStream } from '../utils/cloudinary.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const uploadMiddleware = upload.single('image');

export const uploadImage = async (req, res, next) => {
  try {
    console.log('Incoming request body:', req.body); // Should show { name: 'example.jpg', folderId: '66f...' }
    console.log('Incoming file:', req.file); // Should show { originalname: 'example.jpg', buffer: <Buffer ...>, ... }
    const { name, folderId } = req.body;
    if (!name || !folderId) {
      res.status(400);
      throw new Error('name and folderId required');
    }

    const folder = await Folder.findOne({ _id: folderId, owner: req.user._id });
    if (!folder) {
      res.status(404);
      throw new Error('Folder not found');
    }
    if (!req.file) {
      res.status(400);
      throw new Error('Image required');
    }

    // upload to Cloudinary
    const folderPath = `${req.user._id}/${folder._id}`;
    const result = await uploadStream(req.file.buffer, folderPath);

    const doc = await Image.create({
      name,
      owner: req.user._id,
      folder: folder._id,
      cloudinaryId: result.public_id,
      url: result.secure_url,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error('Upload controller error:', e); // Log the full error here
    next(e);
  }
};

export const searchImages = async (req, res, next) => {
  try {
    const q = (req.query.query || '').trim();
    if (!q) return res.json([]);
    const results = await Image.find({ owner: req.user._id, name: { $regex: q, $options: 'i' } })
      .sort('-createdAt')
      .limit(50);
    res.json(results);
  } catch (e) {
    next(e);
  }
};

// GET /api/images?folderId=xxx&page=1&limit=20
export const getImages = async (req, res) => {
  try {
    const { folderId, page = 1, limit = 20 } = req.query;

    // Build query: user-specific + optional folder filter
    const query = { user: req.user._id };
    if (folderId) query.folderId = folderId;

    const images = await Image.find(query)
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Image.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      images,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const img = await Image.findOne({ _id: id, owner: req.user._id });
    if (!img) {
      res.status(404);
      throw new Error('Image not found');
    }

    await deleteByPublicId(img.cloudinaryId).catch(() => null);
    await img.deleteOne();
    res.json({ message: 'Image deleted' });
  } catch (e) {
    next(e);
  }
};
