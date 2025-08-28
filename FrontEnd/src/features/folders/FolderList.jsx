import {
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  FolderOpenIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteFolder } from './folderSlice.js';

export default function FolderList({ folders, onFolderSelect, selectedFolder }) {
  const dispatch = useDispatch();
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Group folders by parent
  const foldersByParent = folders.reduce((acc, folder) => {
    const parentId = folder.parentFolder || 'root';
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(folder);
    return acc;
  }, {});

  const toggleExpanded = folderId => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleDelete = async folderId => {
    try {
      await dispatch(deleteFolder(folderId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const renderFolderTree = (parentId = 'root', level = 0) => {
    const folders = foldersByParent[parentId] || [];

    return folders.map(folder => {
      const hasChildren = foldersByParent[folder._id]?.length > 0;
      const isExpanded = expandedFolders.has(folder._id);
      const isSelected = selectedFolder?._id === folder._id;

      return (
        <div key={folder._id} className="folder-item">
          {/* Folder Card */}
          <div
            className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            style={{ marginLeft: `${level * 20}px` }}
          >
            {/* Expand/Collapse Button */}
            <button
              onClick={() => toggleExpanded(folder._id)}
              className={`mr-2 p-1 rounded transition-colors ${
                hasChildren
                  ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  : 'text-transparent cursor-default'
              }`}
              disabled={!hasChildren}
            >
              {hasChildren &&
                (isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                ))}
            </button>

            {/* Folder Icon */}
            <FolderOpenIcon className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />

            {/* Folder Info */}
            <div className="flex-grow min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{folder.name}</h3>
              <p className="text-sm text-gray-500">
                Created {new Date(folder.createdAt).toLocaleDateString()}
                {hasChildren && (
                  <span className="ml-2">• {foldersByParent[folder._id].length} subfolder(s)</span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onFolderSelect(isSelected ? null : folder)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={isSelected ? 'Close folder' : 'View folder contents'}
              >
                <EyeIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setDeleteConfirmId(folder._id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete folder"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Children Folders */}
          {hasChildren && isExpanded && (
            <div className="mt-2">{renderFolderTree(folder._id, level + 1)}</div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmId === folder._id && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <TrashIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Delete Folder
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete "{folder.name}"?
                            {hasChildren &&
                              ' This will also delete all subfolders and their contents.'}
                            This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      onClick={() => handleDelete(folder._id)}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  if (!folders || folders.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No folders yet</h3>
        <p className="text-gray-500">Create your first folder to organize your files</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Folders ({folders.length})</h2>
        <div className="text-sm text-gray-500">Click on a folder to view its contents</div>
      </div>

      <div className="space-y-2">{renderFolderTree()}</div>

      {/* Selected Folder Info */}
      {selectedFolder && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Selected Folder: {selectedFolder.name}</h3>
          <p className="text-blue-700 text-sm">
            Created on {new Date(selectedFolder.createdAt).toLocaleDateString()}
            {selectedFolder.parentFolder && ' • Has parent folder'}
          </p>
        </div>
      )}
    </div>
  );
}
