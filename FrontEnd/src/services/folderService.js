// src/services/folderService.js
import axiosInstance from '../utils/axiosInstance.js';

const API_ENDPOINTS = {
  FOLDERS: '/folders',
  FOLDER_BY_ID: id => `/folders/${id}`,
  FOLDER_CONTENTS: id => `/folders/${id}/contents`,
  FOLDER_MOVE: id => `/folders/${id}/move`,
};

class FolderService {
  // Get all folders for the current user
  async getAllFolders(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add query parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.parentFolder) queryParams.append('parentFolder', params.parentFolder);

      const url = `${API_ENDPOINTS.FOLDERS}${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return {
          folders: response.data.folders || [],
          pagination: response.data.pagination || {},
          totalCount: response.data.totalCount || 0,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch folders');
    } catch (error) {
      this.handleError(error, 'Failed to fetch folders');
    }
  }

  // Get folder by ID
  async getFolderById(folderId) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FOLDER_BY_ID(folderId));

      if (response.data.success) {
        return response.data.folder;
      }

      throw new Error(response.data.message || 'Folder not found');
    } catch (error) {
      this.handleError(error, 'Failed to fetch folder');
    }
  }

  // Get folder contents (subfolders and images)
  async getFolderContents(folderId, params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_ENDPOINTS.FOLDER_CONTENTS(folderId)}${
        queryParams.toString() ? `?${queryParams}` : ''
      }`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return {
          folder: response.data.folder,
          subfolders: response.data.subfolders || [],
          images: response.data.images || [],
          pagination: response.data.pagination || {},
        };
      }

      throw new Error(response.data.message || 'Failed to fetch folder contents');
    } catch (error) {
      this.handleError(error, 'Failed to fetch folder contents');
    }
  }

  // Create a new folder
  async createFolder(folderData) {
    try {
      // Validate required fields
      if (!folderData.name || !folderData.name.trim()) {
        throw new Error('Folder name is required');
      }

      const payload = {
        name: folderData.name.trim(),
        description: folderData.description?.trim() || '',
        parentFolder: folderData.parentFolder || null,
        color: folderData.color || null,
        tags: folderData.tags || [],
      };

      const response = await axiosInstance.post(API_ENDPOINTS.FOLDERS, payload);

      if (response.data.success) {
        return response.data.folder;
      }

      throw new Error(response.data.message || 'Failed to create folder');
    } catch (error) {
      this.handleError(error, 'Failed to create folder');
    }
  }

  // Update an existing folder
  async updateFolder(folderId, updateData) {
    try {
      if (!folderId) {
        throw new Error('Folder ID is required');
      }

      const payload = {};

      // Only include fields that are being updated
      if (updateData.name !== undefined) {
        if (!updateData.name.trim()) {
          throw new Error('Folder name cannot be empty');
        }
        payload.name = updateData.name.trim();
      }

      if (updateData.description !== undefined) {
        payload.description = updateData.description.trim();
      }

      if (updateData.color !== undefined) {
        payload.color = updateData.color;
      }

      if (updateData.tags !== undefined) {
        payload.tags = updateData.tags;
      }

      const response = await axiosInstance.put(API_ENDPOINTS.FOLDER_BY_ID(folderId), payload);

      if (response.data.success) {
        return response.data.folder;
      }

      throw new Error(response.data.message || 'Failed to update folder');
    } catch (error) {
      this.handleError(error, 'Failed to update folder');
    }
  }

  // Delete a folder
  async deleteFolder(folderId) {
    try {
      if (!folderId) {
        throw new Error('Folder ID is required');
      }

      const response = await axiosInstance.delete(API_ENDPOINTS.FOLDER_BY_ID(folderId));

      if (response.data.success) {
        return response.data;
      }

      throw new Error(response.data.message || 'Failed to delete folder');
    } catch (error) {
      this.handleError(error, 'Failed to delete folder');
    }
  }

  // Move folder to a different parent
  async moveFolder(folderId, newParentId = null) {
    try {
      if (!folderId) {
        throw new Error('Folder ID is required');
      }

      const payload = {
        newParentId: newParentId,
      };

      const response = await axiosInstance.post(API_ENDPOINTS.FOLDER_MOVE(folderId), payload);

      if (response.data.success) {
        return response.data.folder;
      }

      throw new Error(response.data.message || 'Failed to move folder');
    } catch (error) {
      this.handleError(error, 'Failed to move folder');
    }
  }

  // Get folder breadcrumb path
  async getFolderPath(folderId) {
    try {
      if (!folderId) {
        return [];
      }

      const response = await axiosInstance.get(`${API_ENDPOINTS.FOLDER_BY_ID(folderId)}/path`);

      if (response.data.success) {
        return response.data.path || [];
      }

      throw new Error(response.data.message || 'Failed to fetch folder path');
    } catch (error) {
      this.handleError(error, 'Failed to fetch folder path');
    }
  }

  // Search folders
  async searchFolders(searchQuery, params = {}) {
    try {
      if (!searchQuery || !searchQuery.trim()) {
        throw new Error('Search query is required');
      }

      const queryParams = new URLSearchParams();
      queryParams.append('search', searchQuery.trim());

      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.parentFolder) queryParams.append('parentFolder', params.parentFolder);

      const response = await axiosInstance.get(`${API_ENDPOINTS.FOLDERS}/search?${queryParams}`);

      if (response.data.success) {
        return {
          folders: response.data.folders || [],
          pagination: response.data.pagination || {},
          totalCount: response.data.totalCount || 0,
        };
      }

      throw new Error(response.data.message || 'Search failed');
    } catch (error) {
      this.handleError(error, 'Search failed');
    }
  }

  // Get folder statistics
  async getFolderStats(folderId = null) {
    try {
      const url = folderId
        ? `${API_ENDPOINTS.FOLDER_BY_ID(folderId)}/stats`
        : `${API_ENDPOINTS.FOLDERS}/stats`;

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return response.data.stats;
      }

      throw new Error(response.data.message || 'Failed to fetch folder statistics');
    } catch (error) {
      this.handleError(error, 'Failed to fetch folder statistics');
    }
  }

  // Validate folder name
  validateFolderName(name) {
    if (!name || !name.trim()) {
      return { isValid: false, message: 'Folder name is required' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 1) {
      return { isValid: false, message: 'Folder name must be at least 1 character long' };
    }

    if (trimmedName.length > 100) {
      return { isValid: false, message: 'Folder name must be less than 100 characters' };
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (invalidChars.test(trimmedName)) {
      return { isValid: false, message: 'Folder name contains invalid characters' };
    }

    // Check for reserved names (Windows)
    const reservedNames = [
      'CON',
      'PRN',
      'AUX',
      'NUL',
      'COM1',
      'COM2',
      'COM3',
      'COM4',
      'COM5',
      'COM6',
      'COM7',
      'COM8',
      'COM9',
      'LPT1',
      'LPT2',
      'LPT3',
      'LPT4',
      'LPT5',
      'LPT6',
      'LPT7',
      'LPT8',
      'LPT9',
    ];
    if (reservedNames.includes(trimmedName.toUpperCase())) {
      return { isValid: false, message: 'This folder name is reserved and cannot be used' };
    }

    return { isValid: true, message: 'Valid folder name' };
  }

  // Handle API errors
  handleError(error, defaultMessage) {
    let errorMessage = defaultMessage;

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle specific error codes
    if (error.response?.status === 404) {
      errorMessage = 'Folder not found';
    } else if (error.response?.status === 403) {
      errorMessage = "You don't have permission to access this folder";
    } else if (error.response?.status === 409) {
      errorMessage = 'A folder with this name already exists in this location';
    } else if (error.response?.status === 422) {
      errorMessage = 'Invalid folder data provided';
    }

    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.originalError = error;

    throw customError;
  }
}

// Create and export a singleton instance
const folderService = new FolderService();

export default folderService;
