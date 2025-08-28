import express from 'express';
import {
  createFolder,
  deleteFolder,
  getFolderContents,
  listFolders,
  tree,
  updateFolder,
} from '../controllers/folder.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.post('/', createFolder);
router.get('/', listFolders);
router.get('/tree', tree);
router.get('/:id/contents', getFolderContents);
router.put('/:id', updateFolder);
router.delete('/:id', deleteFolder);

export default router;
