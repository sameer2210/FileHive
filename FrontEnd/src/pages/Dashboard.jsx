// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFolders } from '../features/folders/folderSlice.js';
import { fetchImages, searchImages } from '../features/images/imageSlice.js';

import Loader from '../components/Loader.jsx';
import CreateFolder from '../features/folders/CreateFolder.jsx';
import FolderList from '../features/folders/FolderList.jsx';
import SearchImages from '../features/images/SearchImages.jsx';
import UploadImage from '../features/images/UploadImage.jsx';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { folders, loading: foldersLoading } = useSelector(state => state.folders);
  const { images, loading: imagesLoading, searchResults } = useSelector(state => state.images);

  const [activeTab, setActiveTab] = useState('folders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    dispatch(fetchFolders());
    dispatch(fetchImages());
  }, [dispatch]);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(searchImages(query));
    }
  };

  const tabs = [
    { id: 'folders', label: 'Folders', count: folders.length },
    { id: 'images', label: 'Images', count: images.length },
    { id: 'search', label: 'Search', count: searchResults.length },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name || 'User'}! Manage your files and folders.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <CreateFolder onFolderCreated={() => dispatch(fetchFolders())} />
            <UploadImage onImageUploaded={() => dispatch(fetchImages())} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">{folders.length}</div>
          <div className="text-gray-600 mt-1">Total Folders</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{images.length}</div>
          <div className="text-gray-600 mt-1">Total Images</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600">
            {searchQuery ? searchResults.length : '0'}
          </div>
          <div className="text-gray-600 mt-1">Search Results</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeTab === 'folders' && (
          <div>
            {foldersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader />
                <span className="ml-3 text-gray-600">Loading folders...</span>
              </div>
            ) : (
              <FolderList
                folders={folders}
                onFolderSelect={setSelectedFolder}
                selectedFolder={selectedFolder}
              />
            )}
          </div>
        )}

        {activeTab === 'images' && (
          <div>
            {imagesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader />
                <span className="ml-3 text-gray-600">Loading images...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map(image => (
                  <div key={image._id} className="card">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-medium text-gray-900 truncate">{image.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {image.folder?.name || 'No folder'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <SearchImages
            onSearch={handleSearch}
            searchQuery={searchQuery}
            searchResults={searchResults}
            isLoading={imagesLoading}
          />
        )}
      </div>
    </div>
  );
}
