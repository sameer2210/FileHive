import {
  Bell,
  Folder,
  FolderPlus,
  HardDrive,
  Image,
  MoreHorizontal,
  Search,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchFolders } from '../features/folders/folderSlice.js';
import { fetchImages, searchImages } from '../features/images/imageSlice.js';

import Loader from '../components/Loader.jsx';
import SideBar from '../components/SideBar.jsx';
import CreateFolder from '../features/folders/CreateFolder.jsx';
import FolderList from '../features/folders/FolderList.jsx';
import SearchImages from '../features/images/SearchImages.jsx';
import UploadImage from '../features/images/UploadImage.jsx';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
  } = useSelector(state => state.folders);
  const {
    images,
    loading: imagesLoading,
    searchResults,
    error: imagesError,
  } = useSelector(state => state.images);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch data on mount and handle errors
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([dispatch(fetchFolders()).unwrap(), dispatch(fetchImages()).unwrap()]);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load data. Please refresh the page.');
      }
    };
    loadData();
  }, [dispatch]);

  // Show error toasts
  useEffect(() => {
    if (foldersError) {
      toast.error(foldersError);
    }
  }, [foldersError]);

  useEffect(() => {
    if (imagesError) {
      toast.error(imagesError);
    }
  }, [imagesError]);

  // Fetch images for selected folder when it changes
  useEffect(() => {
    if (selectedFolder) {
      dispatch(fetchImages({ folderId: selectedFolder._id }));
    } else {
      dispatch(fetchImages()); // Fetch all if no folder selected
    }
  }, [selectedFolder, dispatch]);

  // Calculate dynamic storage usage
  const storageData = useMemo(() => {
    const totalStorage = 5; // GB
    const usedStorage = Math.min(images.length * 0.5, totalStorage);
    const storagePercentage = (usedStorage / totalStorage) * 100;
    const remainingStorage = totalStorage - usedStorage;

    return {
      total: totalStorage,
      used: usedStorage,
      percentage: storagePercentage,
      remaining: remainingStorage,
    };
  }, [images.length]);

  // Get recent folders (last 5 created)
  const recentFolders = useMemo(() => {
    return [...folders]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 5);
  }, [folders]);

  // Get recent images (last 5 uploaded)
  const recentImages = useMemo(() => {
    return [...images]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 5);
  }, [images]);

  // Format time ago helper
  const formatTimeAgo = dateString => {
    if (!dateString) return 'Just now';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      if (seconds < 60) return 'Just now';
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Just now';
    }
  };

  // Generate dynamic activity feed
  const recentActivity = useMemo(() => {
    const activities = [];

    // Add folder activities
    recentFolders.slice(0, 3).forEach(folder => {
      activities.push({
        id: `folder-${folder._id}`,
        type: 'folder',
        action: `Created "${folder.name}"`,
        time: formatTimeAgo(folder.createdAt),
        amount: `${folder.images?.length || 0} files`,
        timestamp: new Date(folder.createdAt || Date.now()),
      });
    });

    // Add image activities
    recentImages.slice(0, 3).forEach(image => {
      activities.push({
        id: `image-${image._id}`,
        type: 'upload',
        action: `Uploaded "${image.name}"`,
        time: formatTimeAgo(image.createdAt),
        amount: image.size ? `${(image.size / (1024 * 1024)).toFixed(1)}MB` : 'N/A',
        timestamp: new Date(image.createdAt || Date.now()),
      });
    });

    // Sort by timestamp and return top 5
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [recentFolders, recentImages]);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(searchImages(query));
    }
  };

  // Refresh data when folders/images are created
  const handleFolderCreated = async () => {
    try {
      await dispatch(fetchFolders()).unwrap();
      toast.success('Folder created successfully!');
    } catch (error) {
      toast.error('Failed to refresh folders');
    }
  };

  const handleImageUploaded = async () => {
    try {
      await dispatch(fetchImages()).unwrap();
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to refresh images');
    }
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-stone-600 via-stone-50 to-stone-900  sm:px-4 xl:pt-4 pb-18 lg:pb-4">
      <div className="max-w-8xl mx-auto">
        {/* Main Container */}
        <div className="bg-stone-100  sm:rounded-xl shadow-2xl overflow-hidden">
          <div className="flex min-h-screen">
            {/* Sidebar Component */}
            <SideBar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              user={user}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    {/* Mobile Menu Button */}


                    <div className="min-w-0 flex-1">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                        Dashboard
                      </h1>
                      <p className="hidden sm:block text-gray-600 mt-1 truncate">
                        Manage your files and storage efficiently
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    <div className="relative hidden sm:block">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 text-sm"
                        value={searchQuery}
                        onChange={e => handleSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 sm:p-6 lg:p-8">
                {activeTab === 'summary' && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div className="bg-gradient-to-r from-teal-500 to-emerald-950 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10"></div>
                        <Folder className="h-6 w-6 sm:h-8 sm:w-8 mb-3 sm:mb-4" />
                        <div className="text-2xl sm:text-3xl font-bold">{folders.length}</div>
                        <div className="text-blue-100 text-sm sm:text-base">Total Folders</div>
                      </div>

                      <div className="bg-gradient-to-r from-black to-cyan-600 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10"></div>
                        <Image className="h-6 w-6 sm:h-8 sm:w-8 mb-3 sm:mb-4" />
                        <div className="text-2xl sm:text-3xl font-bold">{images.length}</div>
                        <div className="text-purple-100 text-sm sm:text-base">Images Stored</div>
                      </div>

                      <div className="bg-gradient-to-r from-stone-500 to-rose-500 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden sm:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10"></div>
                        <HardDrive className="h-6 w-6 sm:h-8 sm:w-8 mb-3 sm:mb-4" />
                        <div className="text-2xl sm:text-3xl font-bold">
                          {storageData.used.toFixed(1)}GB
                        </div>
                        <div className="text-green-100 text-sm sm:text-base">Storage Used</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                      {/* Storage Analytics & Quick Actions */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Actions
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CreateFolder
                              onFolderCreated={handleFolderCreated}
                              className="w-full"
                            />
                            <UploadImage onImageUploaded={handleImageUploaded} className="w-full" />
                          </div>
                        </div>

                        {/* Recent Folders */}
                        {recentFolders.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Recent Folders
                              </h3>
                              <button
                                onClick={() => setActiveTab('folders')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                VIEW ALL
                              </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {recentFolders.map(folder => (
                                <div
                                  key={folder._id}
                                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                                  onClick={() => {
                                    setSelectedFolder(folder);
                                    setActiveTab('folders');
                                  }}
                                >
                                  <Folder className="h-5 w-5 text-blue-600 mb-2" />
                                  <div className="font-medium text-gray-900 text-sm truncate">
                                    {folder.name}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {folder.images?.length || 0} files
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recent Images */}
                        {recentImages.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">Recent Images</h3>
                              <button
                                onClick={() => setActiveTab('images')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                VIEW ALL
                              </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                              {recentImages.map(image => (
                                <div
                                  key={image._id}
                                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                                >
                                  <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-24 object-cover"
                                    onError={e => {
                                      e.target.src = 'https://via.placeholder.com/150?text=Image';
                                    }}
                                  />
                                  <div className="p-2">
                                    <p className="text-xs font-medium text-gray-900 truncate">
                                      {image.name}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Storage Analytics */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Storage Analytics
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-sm sm:text-base">
                                Storage Usage
                              </span>
                              <span className="font-semibold text-sm sm:text-base">
                                {storageData.used.toFixed(1)}GB / {storageData.total}GB
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                              <div
                                className="bg-gradient-to-r from-teal-500 to-red-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(storageData.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              {storageData.percentage.toFixed(1)}% of your storage is being used
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar */}
                      <div className="space-y-6">
                        {/* Plan Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Your Plan</h3>
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Premium
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">
                              {storageData.remaining.toFixed(1)}GB remaining
                            </span>
                          </div>
                        </div>

                        {/* Activity */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              SEE ALL
                            </button>
                          </div>
                          {recentActivity.length > 0 ? (
                            <div className="space-y-4">
                              {recentActivity.map(activity => (
                                <div key={activity.id} className="flex items-center space-x-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {activity.type === 'upload' ? (
                                      <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                    ) : (
                                      <FolderPlus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                      {activity.action}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500">
                                      {activity.time}
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                                      {activity.amount}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p className="text-sm">No recent activity</p>
                            </div>
                          )}
                        </div>

                        {/* File Categories */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            File Categories
                          </h3>
                          <div className="text-sm text-gray-600 mb-4">
                            Organize your files efficiently
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 text-center">
                              <Image className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 mx-auto mb-2" />
                              <div className="font-semibold text-gray-900 text-sm">Images</div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                {images.length} files
                              </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 text-center">
                              <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-2" />
                              <div className="font-semibold text-gray-900 text-sm">Folders</div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                {folders.length} items
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'folders' && (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {selectedFolder ? `Images in ${selectedFolder.name}` : 'My Folders'}
                      </h2>
                      {!selectedFolder && <CreateFolder onFolderCreated={handleFolderCreated} />}
                      {selectedFolder && (
                        <button
                          onClick={() => setSelectedFolder(null)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                          Back to Folders
                        </button>
                      )}
                    </div>
                    {foldersLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader />
                        <span className="ml-3 text-gray-600">Loading folders...</span>
                      </div>
                    ) : selectedFolder ? (
                      imagesLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader />
                          <span className="ml-3 text-gray-600">Loading images...</span>
                        </div>
                      ) : images.length === 0 ? (
                        <div className="text-center py-12">
                          <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">No images in this folder yet</p>
                          <UploadImage
                            onImageUploaded={handleImageUploaded}
                            folderId={selectedFolder._id}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                          {images.map(image => (
                            <div
                              key={image._id}
                              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                            >
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-32 sm:h-48 object-cover"
                                onError={e => {
                                  e.target.src = 'https://via.placeholder.com/150?text=Image';
                                }}
                              />
                              <div className="p-3 sm:p-4">
                                <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                  {image.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                  {image.folder?.name || 'No folder'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : folders.length === 0 ? (
                      <div className="text-center py-12">
                        <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No folders yet</p>
                        {/* <CreateFolder onFolderCreated={handleFolderCreated} /> */}
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Images</h2>
                      <UploadImage onImageUploaded={handleImageUploaded} />
                    </div>
                    {imagesLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader />
                        <span className="ml-3 text-gray-600">Loading images...</span>
                      </div>
                    ) : images.length === 0 ? (
                      <div className="text-center py-12">
                        <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No images yet</p>
                        {/* <UploadImage onImageUploaded={handleImageUploaded} /> */}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {images.map(image => (
                          <div
                            key={image._id}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                          >
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-32 sm:h-48 object-cover"
                              onError={e => {
                                e.target.src = 'https://via.placeholder.com/150?text=Image';
                              }}
                            />
                            <div className="p-3 sm:p-4">
                              <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                {image.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {image.folder?.name || 'No folder'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'search' && (
                  <div>
                    <SearchImages />
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Storage Breakdown
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm sm:text-base">Images</span>
                            <span className="font-semibold text-sm sm:text-base">
                              {(images.length * 0.5).toFixed(1)}GB
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm sm:text-base">Folders</span>
                            <span className="font-semibold text-sm sm:text-base">
                              {folders.length} items
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm sm:text-base">Available</span>
                            <span className="font-semibold text-green-600 text-sm sm:text-base">
                              {storageData.remaining.toFixed(1)}GB
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Usage Statistics
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm sm:text-base">Total Files</span>
                            <span className="font-semibold text-sm sm:text-base">
                              {images.length + folders.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm sm:text-base">Storage Used</span>
                            <span className="font-semibold text-sm sm:text-base">
                              {storageData.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm sm:text-base">Account Type</span>
                            <span className="font-semibold text-purple-600 text-sm sm:text-base">
                              Premium
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
