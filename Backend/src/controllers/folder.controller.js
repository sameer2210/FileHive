import Folder from '../models/folder.model.js';

const buildPath = async (name, parentId) => {
  if (!parentId) return `/${name}`;
  const parent = await Folder.findById(parentId);
  const parentPath = parent?.path || '/';
  return `${parentPath}/${name}`.replace(/\\+/g, '/');
};

export const createFolder = async (req, res, next) => {
  try {
    const { name, parent = null } = req.body;
    if (!name) {
      res.status(400);
      throw new Error('Name required');
    }

    if (parent) {
      const parentDoc = await Folder.findOne({ _id: parent, owner: req.user._id });
      if (!parentDoc) {
        res.status(404);
        throw new Error('Parent not found');
      }
    }

    const path = await buildPath(name, parent);
    const folder = await Folder.create({ name, owner: req.user._id, parent: parent || null, path });
    res.status(201).json(folder);
  } catch (e) {
    next(e);
  }
};

export const listFolders = async (req, res, next) => {
  try {
    const folders = await Folder.find({ owner: req.user._id }).sort('createdAt');
    res.json(folders);
  } catch (e) {
    next(e);
  }
};

export const tree = async (req, res, next) => {
  try {
    const folders = await Folder.find({ owner: req.user._id }).lean();
    const map = new Map();
    folders.forEach(f => map.set(String(f._id), { ...f, children: [] }));
    const roots = [];
    folders.forEach(f => {
      if (f.parent) map.get(String(f.parent))?.children.push(map.get(String(f._id)));
      else roots.push(map.get(String(f._id)));
    });
    res.json(roots);
  } catch (e) {
    next(e);
  }
};

export const deleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const target = await Folder.findOne({ _id: id, owner: req.user._id });
    if (!target) {
      res.status(404);
      throw new Error('Folder not found');
    }

    // collect descendants
    const all = await Folder.find({ owner: req.user._id }).select('_id parent');
    const ids = new Set([String(target._id)]);
    let added = true;
    while (added) {
      added = false;
      for (const f of all) {
        if (f.parent && ids.has(String(f.parent)) && !ids.has(String(f._id))) {
          ids.add(String(f._id));
          added = true;
        }
      }
    }
    const folderIds = Array.from(ids);

    // delete folders (images removal handled in image delete endpoint or implement cascade)
    await Folder.deleteMany({ _id: { $in: folderIds } });
    res.json({ message: 'Folder deleted (images should be cleaned separately if needed)' });
  } catch (e) {
    next(e);
  }
};
