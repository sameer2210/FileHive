// src/features/folders/folderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import folderService from '../../services/folderService.js';

// ===== Async Thunks =====

// Get all folders for the current user
export const fetchFolders = createAsyncThunk(
  'folders/fetchFolders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await folderService.getAllFolders(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch folders';
      return rejectWithValue(message);
    }
  }
);

// Create a new folder
export const createFolder = createAsyncThunk(
  'folders/createFolder',
  async (folderData, { rejectWithValue }) => {
    try {
      const response = await folderService.createFolder(folderData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create folder';
      return rejectWithValue(message);
    }
  }
);

// Update an existing folder
export const updateFolder = createAsyncThunk(
  'folders/updateFolder',
  async ({ folderId, updateData }, { rejectWithValue }) => {
    try {
      const response = await folderService.updateFolder(folderId, updateData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update folder';
      return rejectWithValue(message);
    }
  }
);

// Delete a folder
export const deleteFolder = createAsyncThunk(
  'folders/deleteFolder',
  async (folderId, { rejectWithValue }) => {
    try {
      await folderService.deleteFolder(folderId);
      return folderId;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete folder';
      return rejectWithValue(message);
    }
  }
);

// Get folder by ID
export const fetchFolderById = createAsyncThunk(
  'folders/fetchFolderById',
  async (folderId, { rejectWithValue }) => {
    try {
      const response = await folderService.getFolderById(folderId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch folder';
      return rejectWithValue(message);
    }
  }
);

// ===== Helper Functions =====
const buildFolderTree = folders => {
  const folderMap = new Map();
  const rootFolders = [];

  // Create a map of all folders
  folders.forEach(folder => {
    folderMap.set(folder._id, { ...folder, children: [] });
  });

  // Build the tree structure
  folders.forEach(folder => {
    const folderNode = folderMap.get(folder._id);

    if (folder.parentFolder) {
      const parent = folderMap.get(folder.parentFolder);
      if (parent) {
        parent.children.push(folderNode);
      } else {
        // Parent not found, treat as root
        rootFolders.push(folderNode);
      }
    } else {
      rootFolders.push(folderNode);
    }
  });

  return rootFolders;
};

// ===== Initial State =====
const initialState = {
  // Folder data
  folders: [],
  folderTree: [],
  currentFolder: null,

  // UI state
  isLoading: false,
  error: null,

  // Folder operations
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  // Search and filters
  searchQuery: '',
  sortBy: 'name', // 'name', 'createdAt', 'updatedAt'
  sortOrder: 'asc', // 'asc', 'desc'
  viewMode: 'grid', // 'grid', 'list'

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalFolders: 0,
    itemsPerPage: 20,
  },
};

// ===== Folder Slice =====
const folderSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    // Clear errors
    clearError: state => {
      state.error = null;
    },

    // Set current folder
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },

    // Update search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when searching
    },

    // Update sort settings
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },

    // Toggle view mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },

    // Update pagination
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    // Reset folder state
    resetFolderState: state => {
      return { ...initialState };
    },

    // Clear current folder
    clearCurrentFolder: state => {
      state.currentFolder = null;
    },

    // Update folder in the list
    updateFolderInList: (state, action) => {
      const { folderId, updates } = action.payload;
      const folderIndex = state.folders.findIndex(folder => folder._id === folderId);

      if (folderIndex !== -1) {
        state.folders[folderIndex] = { ...state.folders[folderIndex], ...updates };
        state.folderTree = buildFolderTree(state.folders);
      }
    },
  },

  extraReducers: builder => {
    builder
      // ===== Fetch Folders =====
      .addCase(fetchFolders.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload.folders || [];
        state.folderTree = buildFolderTree(state.folders);

        // Update pagination if provided
        if (action.payload.pagination) {
          state.pagination = { ...state.pagination, ...action.payload.pagination };
        }
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.folders = [];
        state.folderTree = [];
      })

      // ===== Create Folder =====
      .addCase(createFolder.pending, state => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.folders.push(action.payload);
        state.folderTree = buildFolderTree(state.folders);
        state.pagination.totalFolders += 1;
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      // ===== Update Folder =====
      .addCase(updateFolder.pending, state => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        state.isUpdating = false;

        const updatedFolder = action.payload;
        const folderIndex = state.folders.findIndex(folder => folder._id === updatedFolder._id);

        if (folderIndex !== -1) {
          state.folders[folderIndex] = updatedFolder;
          state.folderTree = buildFolderTree(state.folders);
        }

        // Update current folder if it's the same one
        if (state.currentFolder && state.currentFolder._id === updatedFolder._id) {
          state.currentFolder = updatedFolder;
        }
      })
      .addCase(updateFolder.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      // ===== Delete Folder =====
      .addCase(deleteFolder.pending, state => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.isDeleting = false;

        const deletedFolderId = action.payload;
        state.folders = state.folders.filter(folder => folder._id !== deletedFolderId);
        state.folderTree = buildFolderTree(state.folders);
        state.pagination.totalFolders = Math.max(0, state.pagination.totalFolders - 1);

        // Clear current folder if it was deleted
        if (state.currentFolder && state.currentFolder._id === deletedFolderId) {
          state.currentFolder = null;
        }
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })

      // ===== Fetch Folder By ID =====
      .addCase(fetchFolderById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFolderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFolder = action.payload;
      })
      .addCase(fetchFolderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currentFolder = null;
      });
  },
});

// Export actions
export const {
  clearError,
  setCurrentFolder,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setViewMode,
  setCurrentPage,
  resetFolderState,
  clearCurrentFolder,
  updateFolderInList,
} = folderSlice.actions;

// Export selectors
export const selectAllFolders = state => state.folders.folders;
export const selectFolderTree = state => state.folders.folderTree;
export const selectCurrentFolder = state => state.folders.currentFolder;
export const selectFoldersLoading = state => state.folders.isLoading;
export const selectFoldersError = state => state.folders.error;
export const selectIsCreatingFolder = state => state.folders.isCreating;
export const selectIsUpdatingFolder = state => state.folders.isUpdating;
export const selectIsDeletingFolder = state => state.folders.isDeleting;
export const selectFolderSearchQuery = state => state.folders.searchQuery;
export const selectFolderSortBy = state => state.folders.sortBy;
export const selectFolderSortOrder = state => state.folders.sortOrder;
export const selectFolderViewMode = state => state.folders.viewMode;
export const selectFolderPagination = state => state.folders.pagination;

// Complex selectors
export const selectFilteredFolders = state => {
  const { folders, searchQuery, sortBy, sortOrder } = state.folders;

  let filtered = folders;

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      folder =>
        folder.name.toLowerCase().includes(query) ||
        folder.description?.toLowerCase().includes(query)
    );
  }

  // Sort folders
  filtered.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
};

export const selectRootFolders = state => {
  return state.folders.folders.filter(folder => !folder.parentFolder);
};

export const selectFoldersByParent = parentId => state => {
  return state.folders.folders.filter(folder => folder.parentFolder === parentId);
};

export const selectFolderPath = folderId => state => {
  const folders = state.folders.folders;
  const path = [];

  let currentFolder = folders.find(f => f._id === folderId);

  while (currentFolder) {
    path.unshift(currentFolder);
    currentFolder = folders.find(f => f._id === currentFolder.parentFolder);
  }

  return path;
};

// Export reducer
export default folderSlice.reducer;
