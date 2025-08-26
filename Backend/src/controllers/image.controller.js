import multer from 'multer';
import Image from '../models/image.model.js';
import Folder from '../models/folder.model.js';
import { uploadStream, deleteByPublicId } from '../utils/cloudinary.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const uploadMiddleware = upload.single('image');

export const uploadImage = async (req, res, next) => {
  try {
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
      public_id: result.public_id,
      url: result.secure_url,
      size: req.file.size,
      contentType: req.file.mimetype,
    });

    res.status(201).json(doc);
  } catch (e) {
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

export const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const img = await Image.findOne({ _id: id, owner: req.user._id });
    if (!img) {
      res.status(404);
      throw new Error('Image not found');
    }

    await deleteByPublicId(img.public_id).catch(() => null);
    await img.deleteOne();
    res.json({ message: 'Image deleted' });
  } catch (e) {
    next(e);
  }
};
