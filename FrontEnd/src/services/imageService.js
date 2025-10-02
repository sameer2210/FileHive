import axiosInstance from '../utils/axiosInstance.js';

const imageService = {
  /*
   * Upload an image to a specific folder
   * @param {FormData} formData - Contains image file, name, and folderId
   * @returns {Promise} - Uploaded image data
   */
  async uploadImage(formData) {
    try {
      const response = await axiosInstance.post('/images/upload/', formData);
      return response.data;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  },

  /*
   * Search images by name for the current user
   * @param {string} query - Search query string
   * @returns {Promise} - Array of matching images
   */
  async searchImages(query) {
    try {
      const response = await axiosInstance.get(`/images/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search images error:', error);
      throw error;
    }
  },

  /*
   * Get all images for the current user
   * @param {string} folderId - Optional folder ID to filter images
   * @returns {Promise} - Array of user's images
   */
  async getImages(folderId = null) {
    try {
      const url = folderId ? `/images?folderId=${folderId}` : '/images';
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Get images error :', error);
      throw error;
    }
  },

  /*
   * Get images by folder ID
   * @param {string} folderId - Folder ID to get images from
   * @returns {Promise} - Array of images in the folder
   */
  async getImagesByFolder(folderId) {
    try {
      const response = await axiosInstance.get(`/images/folder/${folderId}`);
      return response.data;
    } catch (error) {
      console.error('Get images by folder error:', error);
      throw error;
    }
  },

  /*
   * Delete an image by ID
   * @param {string} imageId - ID of the image to delete
   * @returns {Promise} - Delete confirmation
   */
  async deleteImage(imageId) {
    try {
      const response = await axiosInstance.delete(`/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Delete image error:', error);
      throw error;
    }
  },

  /*
   * Update image details (name, folder)
   * @param {string} imageId - ID of the image to update
   * @param {Object} updateData - Data to update (name, folderId)
   * @returns {Promise} - Updated image data
   */
  async updateImage(imageId, updateData) {
    try {
      const response = await axiosInstance.put(`/images/${imageId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Update image error:', error);
      throw error;
    }
  },

  /*
   * Get image details by ID
   * @param {string} imageId - ID of the image
   * @returns {Promise} - Image details
   */
  async getImageById(imageId) {
    try {
      const response = await axiosInstance.get(`/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Get image by ID error:', error);
      throw error;
    }
  },

  /*
   * Move image to different folder
   * @param {string} imageId - ID of the image to move
   * @param {string} newFolderId - ID of the destination folder
   * @returns {Promise} - Updated image data
   */
  async moveImage(imageId, newFolderId) {
    try {
      const response = await axiosInstance.put(`/images/${imageId}/move`, {
        folderId: newFolderId,
      });
      return response.data;
    } catch (error) {
      console.error('Move image error:', error);
      throw error;
    }
  },

  /*
   * Get recently uploaded images
   * @param {number} limit - Number of recent images to fetch (default: 10)
   * @returns {Promise} - Array of recent images
   */
  async getRecentImages(limit = 10) {
    try {
      const response = await axiosInstance.get(`/images/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get recent images error:', error);
      throw error;
    }
  },

  /*
   * Get image statistics for the current user
   * @returns {Promise} - Image statistics (total count, size, etc.)
   */
  async getImageStats() {
    try {
      const response = await axiosInstance.get('/images/stats');
      return response.data;
    } catch (error) {
      console.error('Get image stats error:', error);
      throw error;
    }
  },
};

export default imageService;
