import axiosInstance from '../utils/axiosInstance.js';

// Create new folder
export const createFolderAPI = async folderData => {
  const response = await axiosInstance.post('/folders', folderData);
  return response.data;
};

// Get all folders for current user
export const getFoldersAPI = async () => {
  const response = await axiosInstance.get('/folders');
  return response.data;
};

// Get folder tree structure
export const getFolderTreeAPI = async () => {
  const response = await axiosInstance.get('/folders/tree');
  return response.data;
};

// Get folder contents (subfolders + images)
export const getFolderContentsAPI = async folderId => {
  const response = await axiosInstance.get(`/folders/${folderId}/contents`);
  return response.data;
};

// Update folder
export const updateFolderAPI = async ({ folderId, updateData }) => {
  const response = await axiosInstance.put(`/folders/${folderId}`, updateData);
  return response.data;
};

// Delete folder
export const deleteFolderAPI = async folderId => {
  const response = await axiosInstance.delete(`/folders/${folderId}`);
  return response.data;
};

export default {
  createFolderAPI,
  getFoldersAPI,
  getFolderTreeAPI,
  getFolderContentsAPI,
  updateFolderAPI,
  deleteFolderAPI,
};
