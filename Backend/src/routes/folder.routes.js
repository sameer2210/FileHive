import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createFolder, listFolders, tree, deleteFolder } from '../controllers/folder.controller.js';

const router = express.Router();
router.use(protect);

router.post('/', createFolder);
router.get('/', listFolders);
router.get('/tree', tree);
router.delete('/:id', deleteFolder);

export default router;
