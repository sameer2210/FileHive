// src/features/folders/CreateFolder.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createFolder } from './folderSlice.js';
import { PlusIcon, FolderPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function CreateFolder({ onFolderCreated, parentFolder = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { folders, loading } = useSelector(state => state.folders);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    try {
      const folderData = {
        name: data.name,
        parentFolder: data.parentFolder || null,
      };

      const result = await dispatch(createFolder(folderData));
      if (result.meta.requestStatus === 'fulfilled') {
        reset();
        setIsModalOpen(false);
        if (onFolderCreated) {
          onFolderCreated();
        }
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary flex items-center gap-2"
      >
        <FolderPlusIcon className="w-5 h-5" />
        New Folder
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FolderPlusIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Create New Folder</h3>
                      <p className="text-sm text-gray-500">Organize your files with a new folder</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                  {/* Folder Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Folder Name *
                    </label>
                    <input
                      type="text"
                      {...register('name', {
                        required: 'Folder name is required',
                        minLength: {
                          value: 1,
                          message: 'Folder name cannot be empty',
                        },
                        maxLength: {
                          value: 50,
                          message: 'Folder name cannot exceed 50 characters',
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9\s\-_\.]+$/,
                          message:
                            'Folder name can only contain letters, numbers, spaces, hyphens, underscores, and dots',
                        },
                      })}
                      className="input"
                      placeholder="Enter folder name"
                      disabled={loading}
                      autoFocus
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Parent Folder (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Folder (Optional)
                    </label>
                    <select {...register('parentFolder')} className="input" disabled={loading}>
                      <option value="">Root (No parent folder)</option>
                      {folders.map(folder => (
                        <option key={folder._id} value={folder._id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to create folder in root directory
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn btn-secondary"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center">
                          <div className="loader mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        <>
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Create Folder
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
