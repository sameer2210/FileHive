// src/features/images/UploadImage.jsx
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from './imageSlice';

export default function UploadImage({ onImageUploaded, folderId = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(folderId || '');
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { folders } = useSelector(state => state.folders);

  const handleFileSelect = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!selectedFolderId) {
      alert('Please choose a folder to upload into.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('name', selectedFile.name); // <-- REQUIRED
      formData.append('folderId', selectedFolderId);

    // console.log([...formData.entries()]);

      const resultAction = await dispatch(uploadImage(formData));
      if (uploadImage.fulfilled.match(resultAction)) {
        handleClose();
        if (onImageUploaded) onImageUploaded();
      }
      setUploading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreview(null);
    setSelectedFolderId(folderId || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModalContentClick = e => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Upload Image
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg"
            onClick={handleModalContentClick}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
                  <p className="text-sm text-gray-500">Choose an image to upload</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* File Input */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  {selectedFile ? (
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-green-500 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 mt-2">{selectedFile.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-gray-400 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 mt-2">Click to select image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Preview */}
              {preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain bg-gray-50 rounded-lg"
                  />
                </div>
              )}

              {/* Folder Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload to Folder
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={selectedFolderId}
                  onChange={e => setSelectedFolderId(e.target.value)}
                >
                  <option value="">Select a folder</option>
                  {folders.map(folder => (
                    <option key={folder._id} value={folder._id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors duration-200"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !selectedFolderId || uploading}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
