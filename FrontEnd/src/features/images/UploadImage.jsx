// src/features/images/UploadImage.jsx
import { CloudArrowUpIcon, DocumentIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from './imageSlice.js';

export default function UploadImage({ onImageUploaded, selectedFolder = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { folders } = useSelector(state => state.folders);
  const { loading } = useSelector(state => state.images);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedFolderId = watch('folderId');

  const handleFileSelect = file => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setValue('image', file);

      // Create preview
      const reader = new FileReader();
      reader.onload = e => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);

      // Auto-fill name if empty
      const fileName = file.name.split('.')[0];
      setValue('name', fileName);
    }
  };

  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async data => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('image', selectedFile);
      if (data.folderId) {
        formData.append('folderId', data.folderId);
      }

      const result = await dispatch(uploadImage(formData));
      if (result.meta.requestStatus === 'fulfilled') {
        handleClose();
        if (onImageUploaded) {
          onImageUploaded();
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    setDragActive(false);
    reset();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValue('image', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary flex items-center gap-2"
      >
        <CloudArrowUpIcon className="w-5 h-5" />
        Upload Image
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CloudArrowUpIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Upload Image</h3>
                      <p className="text-sm text-gray-500">Add a new image to your collection</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* File Upload Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Image *
                    </label>

                    {!selectedFile ? (
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="space-y-2">
                          <p className="text-gray-600">
                            <span className="font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileSelect(e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="border border-gray-300 rounded-lg p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <DocumentIcon className="w-full h-full text-gray-400 p-2" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium text-gray-900 truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeSelectedFile}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Name *
                    </label>
                    <input
                      type="text"
                      {...register('name', {
                        required: 'Image name is required',
                        minLength: {
                          value: 1,
                          message: 'Image name cannot be empty',
                        },
                        maxLength: {
                          value: 100,
                          message: 'Image name cannot exceed 100 characters',
                        },
                      })}
                      className="input"
                      placeholder="Enter image name"
                      disabled={loading}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Folder Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload to Folder (Optional)
                    </label>
                    <select
                      {...register('folderId')}
                      className="input"
                      disabled={loading}
                      defaultValue={selectedFolder?._id || ''}
                    >
                      <option value="">Root (No folder)</option>
                      {folders.map(folder => (
                        <option key={folder._id} value={folder._id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose a folder to organize your image
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
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || !selectedFile}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="loader mr-2"></div>
                          Uploading...
                        </div>
                      ) : (
                        <>
                          <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                          Upload Image
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
