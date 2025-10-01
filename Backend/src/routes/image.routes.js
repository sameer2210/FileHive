import express from 'express';
import {
  deleteImage,
  getImages,
  searchImages,
  uploadImage,
  uploadMiddleware,
} from '../controllers/image.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/', getImages);
router.post('/upload', uploadMiddleware, uploadImage); // form-data: name, folderId, image
router.get('/search', searchImages); // ?query=...
router.delete('/:id', deleteImage);

export default router;
