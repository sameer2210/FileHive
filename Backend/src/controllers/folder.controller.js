// import Folder from '../models/folder.model.js';

// const buildPath = async (name, parentId) => {
//   if (!parentId) return `/${name}`;
//   const parent = await Folder.findById(parentId);
//   const parentPath = parent?.path || '/';
//   return `${parentPath}/${name}`.replace(/\\+/g, '/');
// };

// export const createFolder = async (req, res, next) => {
//   try {
//     const { name, parent = null } = req.body;
//     if (!name) {
//       res.status(400);
//       throw new Error('Name required');
//     }

//     if (parent) {
//       const parentDoc = await Folder.findOne({ _id: parent, owner: req.user._id });
//       if (!parentDoc) {
//         res.status(404);
//         throw new Error('Parent not found');
//       }
//     }

//     const path = await buildPath(name, parent);
//     const folder = await Folder.create({ name, owner: req.user._id, parent: parent || null, path });
//     res.status(201).json(folder);
//   } catch (e) {
//     next(e);
//   }
// };

// export const listFolders = async (req, res, next) => {
//   try {
//     const folders = await Folder.find({ owner: req.user._id }).sort('createdAt');
//     res.json(folders);
//   } catch (e) {
//     next(e);
//   }
// };

// export const tree = async (req, res, next) => {
//   try {
//     const folders = await Folder.find({ owner: req.user._id }).lean();
//     const map = new Map();
//     folders.forEach(f => map.set(String(f._id), { ...f, children: [] }));
//     const roots = [];
//     folders.forEach(f => {
//       if (f.parent) map.get(String(f.parent))?.children.push(map.get(String(f._id)));
//       else roots.push(map.get(String(f._id)));
//     });
//     res.json(roots);
//   } catch (e) {
//     next(e);
//   }
// };

// export const deleteFolder = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const target = await Folder.findOne({ _id: id, owner: req.user._id });
//     if (!target) {
//       res.status(404);
//       throw new Error('Folder not found');
//     }

//     // collect descendants
//     const all = await Folder.find({ owner: req.user._id }).select('_id parent');
//     const ids = new Set([String(target._id)]);
//     let added = true;
//     while (added) {
//       added = false;
//       for (const f of all) {
//         if (f.parent && ids.has(String(f.parent)) && !ids.has(String(f._id))) {
//           ids.add(String(f._id));
//           added = true;
//         }
//       }
//     }
//     const folderIds = Array.from(ids);

//     // delete folders (images removal handled in image delete endpoint or implement cascade)
//     await Folder.deleteMany({ _id: { $in: folderIds } });
//     res.json({ message: 'Folder deleted (images should be cleaned separately if needed)' });
//   } catch (e) {
//     next(e);
//   }
// };



// src/controllers/folder.controller.js
import Folder from '../models/folder.model.js';
import Image from '../models/image.model.js';

const buildPath = async (name, parentId) => {
  if (!parentId) return `/${name}`;
  const parent = await Folder.findById(parentId);
  const parentPath = parent?.path || '/';
  return `${parentPath}/${name}`.replace(/\/+/g, '/');
};

export const createFolder = async (req, res, next) => {
  try {
    const { name, parentFolder = null } = req.body; // Changed from 'parent' to 'parentFolder'

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Check if parent exists (if provided)
    if (parentFolder) {
      const parentDoc = await Folder.findOne({ _id: parentFolder, owner: req.user._id });
      if (!parentDoc) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
    }

    // Check for duplicate folder name in same parent
    const existing = await Folder.findOne({
      name: name.trim(),
      owner: req.user._id,
      parent: parentFolder || null
    });

    if (existing) {
      return res.status(400).json({ message: 'Folder with this name already exists in this location' });
    }

    const path = await buildPath(name.trim(), parentFolder);
    const folder = await Folder.create({
      name: name.trim(),
      owner: req.user._id,
      parent: parentFolder || null,
      path
    });

    // Return folder with parentFolder field for frontend compatibility
    const result = {
      ...folder.toObject(),
      parentFolder: folder.parent
    };

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const listFolders = async (req, res, next) => {
  try {
    const folders = await Folder.find({ owner: req.user._id })
      .populate('parent', 'name')
      .sort('createdAt');

    // Transform data for frontend compatibility
    const result = folders.map(folder => ({
      ...folder.toObject(),
      parentFolder: folder.parent?._id || null,
      parentName: folder.parent?.name || null
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getFolderContents = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get folder details
    const folder = await Folder.findOne({ _id: id, owner: req.user._id });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Get subfolders
    const subfolders = await Folder.find({ parent: id, owner: req.user._id }).sort('name');

    // Get images in this folder
    const images = await Image.find({ folder: id, owner: req.user._id }).sort('createdAt');

    res.json({
      folder: {
        ...folder.toObject(),
        parentFolder: folder.parent
      },
      subfolders: subfolders.map(f => ({
        ...f.toObject(),
        parentFolder: f.parent
      })),
      images
    });
  } catch (error) {
    next(error);
  }
};

export const updateFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const folder = await Folder.findOne({ _id: id, owner: req.user._id });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Check for duplicate name in same parent
    const existing = await Folder.findOne({
      name: name.trim(),
      owner: req.user._id,
      parent: folder.parent,
      _id: { $ne: id }
    });

    if (existing) {
      return res.status(400).json({ message: 'Folder with this name already exists in this location' });
    }

    folder.name = name.trim();
    folder.path = await buildPath(folder.name, folder.parent);
    await folder.save();

    const result = {
      ...folder.toObject(),
      parentFolder: folder.parent
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const tree = async (req, res, next) => {
  try {
    const folders = await Folder.find({ owner: req.user._id }).lean();
    const map = new Map();

    // Transform and create map
    folders.forEach(f => {
      map.set(String(f._id), {
        ...f,
        parentFolder: f.parent,
        children: []
      });
    });

    const roots = [];
    folders.forEach(f => {
      const folderNode = map.get(String(f._id));
      if (f.parent) {
        const parentNode = map.get(String(f.parent));
        if (parentNode) {
          parentNode.children.push(folderNode);
        }
      } else {
        roots.push(folderNode);
      }
    });

    res.json(roots);
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const target = await Folder.findOne({ _id: id, owner: req.user._id });
    if (!target) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Collect all descendant folders
    const all = await Folder.find({ owner: req.user._id }).select('_id parent');
    const folderIds = new Set([String(target._id)]);
    let added = true;

    while (added) {
      added = false;
      for (const f of all) {
        if (f.parent && folderIds.has(String(f.parent)) && !folderIds.has(String(f._id))) {
          folderIds.add(String(f._id));
          added = true;
        }
      }
    }

    const folderIdArray = Array.from(folderIds);

    // Delete all images in these folders
    await Image.deleteMany({
      folder: { $in: folderIdArray },
      owner: req.user._id
    });

    // Delete all folders
    await Folder.deleteMany({
      _id: { $in: folderIdArray },
      owner: req.user._id
    });

    res.json({
      message: 'Folder and all its contents deleted successfully',
      deletedFolders: folderIdArray.length
    });
  } catch (error) {
    next(error);
  }
};