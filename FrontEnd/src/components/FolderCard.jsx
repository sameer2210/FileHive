// src/components/FolderCard.jsx
import {
  Calendar,
  Edit2,
  Eye,
  Folder,
  FolderOpen,
  FolderPlus,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { deleteFolder, updateFolder } from '../features/folders/folderSlice.js';

export default function FolderCard({ folder, showActions = true, onClick, className = '' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle folder click
  const handleFolderClick = e => {
    e.stopPropagation();

    if (onClick) {
      onClick(folder);
    } else {
      // Navigate to folder contents
      navigate(`/dashboard/folder/${folder._id}`);
    }
  };

  // Handle edit folder name
  const handleEdit = e => {
    e.stopPropagation();
    setIsEditing(true);
    setShowMenu(false);
  };

  // Save edited name
  const handleSaveEdit = async e => {
    e.stopPropagation();

    if (!editName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }

    if (editName.trim() === folder.name) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(
        updateFolder({
          folderId: folder._id,
          updateData: { name: editName.trim() },
        })
      ).unwrap();

      toast.success('Folder renamed successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error || 'Failed to rename folder');
      setEditName(folder.name);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel edit
  const handleCancelEdit = e => {
    e.stopPropagation();
    setEditName(folder.name);
    setIsEditing(false);
  };

  // Handle delete folder
  const handleDelete = async e => {
    e.stopPropagation();

    if (
      !window.confirm(
        `Are you sure you want to delete "${folder.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(deleteFolder(folder._id)).unwrap();
      toast.success('Folder deleted successfully');
      setShowMenu(false);
    } catch (error) {
      toast.error(error || 'Failed to delete folder');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press for editing
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSaveEdit(e);
    } else if (e.key === 'Escape') {
      handleCancelEdit(e);
    }
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
      className={`relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group ${className}`}
      onClick={handleFolderClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Folder Icon */}
          <div
            className={`p-3 rounded-lg transition-colors ${
              isHovered ? 'bg-indigo-100' : 'bg-gray-100'
            }`}
          >
            {isHovered ? (
              <FolderOpen
                className={`h-8 w-8 ${
                  isHovered ? 'text-indigo-600' : 'text-gray-600'
                } transition-colors`}
              />
            ) : (
              <Folder
                className={`h-8 w-8 ${
                  isHovered ? 'text-indigo-600' : 'text-gray-600'
                } transition-colors`}
              />
            )}
          </div>

          {/* Actions Menu */}
          {showActions && (
            <div className="relative">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className={`p-2 rounded-lg transition-all ${
                  showMenu || isHovered
                    ? 'bg-gray-100 text-gray-700'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Rename
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/dashboard/folder/${folder._id}`);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Open
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

        {/* Folder Name */}
        <div className="mb-3">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSaveEdit}
                className="w-full px-2 py-1 text-lg font-semibold text-gray-900 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onClick={e => e.stopPropagation()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {folder.name}
            </h3>
          )}
        </div>

        {/* Folder Description */}
        {folder.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{folder.description}</p>
        )}

        {/* Folder Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {/* Subfolder count */}
            {folder.subfolderCount > 0 && (
              <div className="flex items-center gap-1">
                <FolderPlus className="h-4 w-4" />
                <span>{folder.subfolderCount} folders</span>
              </div>
            )}

            {/* Image count */}
            {folder.imageCount > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{folder.imageCount} images</span>
              </div>
            )}
          </div>
        </div>

        {/* Created Date */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(folder.createdAt)}</span>
          </div>
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
