// src/features/images/imageSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import imageService from '../../services/imageService.js';

// ===== Async Thunks =====
export const fetchImages = createAsyncThunk(
  'images/fetchImages',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await imageService.getImages(params.folderId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch images';
      return rejectWithValue(message);
    }
  }
);

export const uploadImage = createAsyncThunk(
  'images/uploadImage',
  async (imageData, { rejectWithValue }) => {
    try {
      const response = await imageService.uploadImage(imageData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to upload image';
      return rejectWithValue(message);
    }
  }
);

export const deleteImage = createAsyncThunk(
  'images/deleteImage',
  async (imageId, { rejectWithValue }) => {
    try {
      await imageService.deleteImage(imageId);
      return imageId;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete image';
      return rejectWithValue(message);
    }
  }
);

export const searchImages = createAsyncThunk(
  'images/searchImages',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await imageService.searchImages(query, params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Search failed';
      return rejectWithValue(message);
    }
  }
);

export const updateImage = createAsyncThunk(
  'images/updateImage',
  async ({ imageId, updateData }, { rejectWithValue }) => {
    try {
      const response = await imageService.updateImage(imageId, updateData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update image';
      return rejectWithValue(message);
    }
  }
);

// ===== Initial State =====
const initialState = {
  images: [],
  currentImage: null,
  selectedImages: [],

  // Loading states
  isLoading: false,
  isUploading: false,
  isDeleting: false,
  isSearching: false,

  // Upload progress
  uploadProgress: 0,

  // Search
  searchQuery: '',
  searchResults: [],

  // Error handling
  error: null,

  // View settings
  viewMode: 'grid',
  sortBy: 'createdAt',
  sortOrder: 'desc',

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalImages: 0,
    itemsPerPage: 24,
  },
};

// ===== Image Slice =====
const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },

    setCurrentImage: (state, action) => {
      state.currentImage = action.payload;
    },

    clearCurrentImage: state => {
      state.currentImage = null;
    },

    selectImage: (state, action) => {
      const imageId = action.payload;
      if (!state.selectedImages.includes(imageId)) {
        state.selectedImages.push(imageId);
      }
    },

    deselectImage: (state, action) => {
      const imageId = action.payload;
      state.selectedImages = state.selectedImages.filter(id => id !== imageId);
    },

    clearSelection: state => {
      state.selectedImages = [];
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    clearSearch: state => {
      state.searchQuery = '';
      state.searchResults = [];
    },

    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },

    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },

    resetImageState: () => initialState,
  },

  extraReducers: builder => {
    builder
      // Fetch Images
      .addCase(fetchImages.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload.images || [];
        if (action.payload.pagination) {
          state.pagination = { ...state.pagination, ...action.payload.pagination };
        }
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Upload Image
      .addCase(uploadImage.pending, state => {
        state.isUploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 100;
        state.images.unshift(action.payload);
        state.pagination.totalImages += 1;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 0;
        state.error = action.payload;
      })

      // Delete Image
      .addCase(deleteImage.pending, state => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedImageId = action.payload;
        state.images = state.images.filter(image => image._id !== deletedImageId);
        state.selectedImages = state.selectedImages.filter(id => id !== deletedImageId);
        state.pagination.totalImages = Math.max(0, state.pagination.totalImages - 1);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })

      // Search Images
      .addCase(searchImages.pending, state => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchImages.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchImages.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
        state.searchResults = [];
      })

      // Update Image
      .addCase(updateImage.pending, state => {
        state.error = null;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        const updatedImage = action.payload;
        const imageIndex = state.images.findIndex(img => img._id === updatedImage._id);
        if (imageIndex !== -1) {
          state.images[imageIndex] = updatedImage;
        }
        if (state.currentImage && state.currentImage._id === updatedImage._id) {
          state.currentImage = updatedImage;
        }
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentImage,
  clearCurrentImage,
  selectImage,
  deselectImage,
  clearSelection,
  setSearchQuery,
  clearSearch,
  setViewMode,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setUploadProgress,
  resetImageState,
} = imageSlice.actions;

// Selectors
export const selectAllImages = state => state.images.images;
export const selectCurrentImage = state => state.images.currentImage;
export const selectSelectedImages = state => state.images.selectedImages;
export const selectImagesLoading = state => state.images.isLoading;
export const selectImagesError = state => state.images.error;
export const selectSearchResults = state => state.images.searchResults;
export const selectSearchQuery = state => state.images.searchQuery;
export const selectIsSearching = state => state.images.isSearching;
export const selectIsUploading = state => state.images.isUploading;
export const selectUploadProgress = state => state.images.uploadProgress;
export const selectImagePagination = state => state.images.pagination;

export default imageSlice.reducer;
