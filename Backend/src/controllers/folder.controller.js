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
    const { name, parentFolder = null } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    let effectiveParentId = null;
    if (parentFolder) {
      if (parentFolder.match(/^[0-9a-fA-F]{24}$/)) {
        effectiveParentId = parentFolder;
      } else {
        const parentByName = await Folder.findOne({
          name: parentFolder.trim(),
          owner: req.user._id,
          parent: null, // Only root folders to avoid ambiguity
        });
        if (!parentByName) {
          return res.status(404).json({ message: 'Parent folder not found by name' });
        }
        effectiveParentId = parentByName._id;
      }

      const parentDoc = await Folder.findOne({ _id: effectiveParentId, owner: req.user._id });
      if (!parentDoc) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
    }

    // Check for duplicate folder name in same parent
    const existing = await Folder.findOne({
      name: name.trim(),
      owner: req.user._id,
      parent: effectiveParentId || null,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: 'Folder with this name already exists in this location' });
    }

    const path = await buildPath(name.trim(), effectiveParentId);
    const folder = await Folder.create({
      name: name.trim(),
      owner: req.user._id,
      parent: effectiveParentId || null,
      path,
    });

    // Return folder with parentFolder field for frontend compatibility
    const result = {
      ...folder.toObject(),
      parentFolder: folder.parent,
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
      parentName: folder.parent?.name || null,
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
        parentFolder: folder.parent,
      },
      subfolders: subfolders.map(f => ({
        ...f.toObject(),
        parentFolder: f.parent,
      })),
      images,
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
      _id: { $ne: id },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: 'Folder with this name already exists in this location' });
    }

    folder.name = name.trim();
    folder.path = await buildPath(folder.name, folder.parent);
    await folder.save();

    const result = {
      ...folder.toObject(),
      parentFolder: folder.parent,
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
        children: [],
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
      owner: req.user._id,
    });

    // Delete all folders
    await Folder.deleteMany({
      _id: { $in: folderIdArray },
      owner: req.user._id,
    });

    res.json({
      message: 'Folder and all its contents deleted successfully',
      deletedFolders: folderIdArray.length,
    });
  } catch (error) {
    next(error);
  }
};
