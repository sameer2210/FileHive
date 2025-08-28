// import express from 'express';
// import { registerUser, loginUser } from '../controllers/auth.controller.js';

// const router = express.Router();

// router.post('/signup', registerUser);
// router.post('/login', loginUser);

// export default router;




// src/routes/folder.routes.js
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createFolder,
  listFolders,
  getFolderContents,
  updateFolder,
  tree,
  deleteFolder
} from '../controllers/folder.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Create folder
router.post('/', createFolder);

// Get all folders for user
router.get('/', listFolders);

// Get folder tree structure
router.get('/tree', tree);

// Get specific folder contents (subfolders + images)
router.get('/:id/contents', getFolderContents);

// Update folder
router.put('/:id', updateFolder);

// Delete folder
router.delete('/:id', deleteFolder);

export default router;