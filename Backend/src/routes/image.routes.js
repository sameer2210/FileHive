import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  uploadMiddleware,
  uploadImage,
  searchImages,
  deleteImage,
} from '../controllers/image.controller.js';

const router = express.Router();
router.use(protect);

router.post('/upload', uploadMiddleware, uploadImage); // form-data: name, folderId, image
router.get('/search', searchImages); // ?query=...
router.delete('/:id', deleteImage);

export default router;
