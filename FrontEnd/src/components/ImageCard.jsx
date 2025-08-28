import {
  Calendar,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  HardDrive,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { deleteImage, updateImage } from '../features/images/imageSlice.js';

export default function ImageCard({ image, showActions = true, onClick, className = '' }) {
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(image.name);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle image click
  const handleImageClick = e => {
    e.stopPropagation();

    if (onClick) {
      onClick(image);
    } else {
      // Open image in new tab or modal
      window.open(image.url, '_blank');
    }
  };

  // Handle edit image name
  const handleEdit = e => {
    e.stopPropagation();
    setIsEditing(true);
    setShowMenu(false);
  };

  // Save edited name
  const handleSaveEdit = async e => {
    e.stopPropagation();

    if (!editName.trim()) {
      toast.error('Image name cannot be empty');
      return;
    }

    if (editName.trim() === image.name) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(
        updateImage({
          imageId: image._id,
          updateData: { name: editName.trim() },
        })
      ).unwrap();

      toast.success('Image renamed successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error || 'Failed to rename image');
      setEditName(image.name);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel edit
  const handleCancelEdit = e => {
    e.stopPropagation();
    setEditName(image.name);
    setIsEditing(false);
  };

  // Handle delete image
  const handleDelete = async e => {
    e.stopPropagation();

    if (
      !window.confirm(
        `Are you sure you want to delete "${image.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(deleteImage(image._id)).unwrap();
      toast.success('Image deleted successfully');
      setShowMenu(false);
    } catch (error) {
      toast.error(error || 'Failed to delete image');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download
  const handleDownload = e => {
    e.stopPropagation();

    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Download started');
    setShowMenu(false);
  };

  // Handle key press for editing
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSaveEdit(e);
    } else if (e.key === 'Escape') {
      handleCancelEdit(e);
    }
  };

  // Format file size
  const formatFileSize = bytes => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden ${className}`}
      onClick={handleImageClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Image Container */}
      <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden relative">
        {!imageError ? (
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Image unavailable</p>
            </div>
          </div>
        )}

        {/* Overlay Actions */}
        {showActions && (
          <div
            className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  window.open(image.url, '_blank');
                }}
                className="p-2 bg-white bg-opacity-90 hover:bg-white rounded-full transition-all"
                title="View full size"
              >
                <ExternalLink className="h-4 w-4 text-gray-700" />
              </button>

              <button
                onClick={handleDownload}
                className="p-2 bg-white bg-opacity-90 hover:bg-white rounded-full transition-all"
                title="Download"
              >
                <Download className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        )}

        {/* Actions Menu Button */}
        {showActions && (
          <div className="absolute top-2 right-2">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className={`p-2 rounded-lg transition-all ${
                showMenu || isHovered
                  ? 'bg-black bg-opacity-50 text-white'
                  : 'bg-black bg-opacity-30 text-white hover:bg-opacity-50'
              }`}
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    window.open(image.url, '_blank');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Full Size
                </button>

                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>

                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Rename
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Details */}
      <div className="p-4">
        {/* Image Name */}
        <div className="mb-2">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSaveEdit}
                className="w-full px-2 py-1 text-sm font-semibold text-gray-900 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onClick={e => e.stopPropagation()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {image.name}
            </h3>
          )}
        </div>

        {/* Image Metadata */}
        <div className="space-y-2 text-xs text-gray-500">
          {/* File Size */}
          <div className="flex items-center gap-2">
            <HardDrive className="h-3 w-3" />
            <span>{formatFileSize(image.size)}</span>
          </div>

          {/* Upload Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Uploaded {formatDate(image.createdAt)}</span>
          </div>

          {/* File Type */}
          {image.mimeType && (
            <div className="flex items-center gap-2">
              <ImageIcon className="h-3 w-3" />
              <span>{image.mimeType.split('/')[1].toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div
        className={`absolute inset-0 rounded-xl ring-2 ring-indigo-500 ring-opacity-0 transition-all duration-200 pointer-events-none ${
          isHovered ? 'ring-opacity-20' : ''
        }`}
      />
    </div>
  );
}
