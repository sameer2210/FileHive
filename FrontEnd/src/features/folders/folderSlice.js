import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createFolderAPI,
  deleteFolderAPI,
  getFolderContentsAPI,
  getFoldersAPI,
  getFolderTreeAPI,
  updateFolderAPI,
} from '../../services/folderService.js';

// Create folder
export const createFolder = createAsyncThunk(
  'folders/create',
  async (folderData, { rejectWithValue }) => {
    try {
      const response = await createFolderAPI(folderData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create folder'
      );
    }
  }
);

// Fetch all folders
export const fetchFolders = createAsyncThunk('folders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await getFoldersAPI();
    return response;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Failed to fetch folders'
    );
  }
});

// Fetch folder tree
export const fetchFolderTree = createAsyncThunk(
  'folders/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFolderTreeAPI();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch folder tree'
      );
    }
  }
);

// Fetch folder contents
export const fetchFolderContents = createAsyncThunk(
  'folders/fetchContents',
  async (folderId, { rejectWithValue }) => {
    try {
      const response = await getFolderContentsAPI(folderId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch folder contents'
      );
    }
  }
);

// Update folder
export const updateFolder = createAsyncThunk(
  'folders/update',
  async ({ folderId, updateData }, { rejectWithValue }) => {
    try {
      const response = await updateFolderAPI({ folderId, updateData });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update folder'
      );
    }
  }
);

// Delete folder
export const deleteFolder = createAsyncThunk(
  'folders/delete',
  async (folderId, { rejectWithValue }) => {
    try {
      await deleteFolderAPI(folderId);
      return folderId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete folder'
      );
    }
  }
);

const initialState = {
  folders: [],
  folderTree: [],
  selectedFolder: null,
  selectedFolderContents: {
    folder: null,
    subfolders: [],
    images: [],
  },
  loading: false,
  error: null,
};

const folderSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setSelectedFolder: (state, action) => {
      state.selectedFolder = action.payload;
    },
    clearSelectedFolder: state => {
      state.selectedFolder = null;
      state.selectedFolderContents = initialState.selectedFolderContents;
    },
  },
  extraReducers: builder => {
    builder
      // Create folder
      .addCase(createFolder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.loading = false;
        state.folders.push(action.payload);
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch folders
      .addCase(fetchFolders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch folder tree
      .addCase(fetchFolderTree.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolderTree.fulfilled, (state, action) => {
        state.loading = false;
        state.folderTree = action.payload;
      })
      .addCase(fetchFolderTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch folder contents
      .addCase(fetchFolderContents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolderContents.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFolderContents = action.payload;
      })
      .addCase(fetchFolderContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update folder
      .addCase(updateFolder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.folders.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
      })
      .addCase(updateFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete folder
      .addCase(deleteFolder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = state.folders.filter(f => f._id !== action.payload);
        if (state.selectedFolder?._id === action.payload) {
          state.selectedFolder = null;
          state.selectedFolderContents = initialState.selectedFolderContents;
        }
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedFolder, clearSelectedFolder } = folderSlice.actions;
export default folderSlice.reducer;
