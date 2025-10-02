// src/features/images/SearchImages.jsx
import { Filter, Image as ImageIcon, Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ImageCard from '../../components/ImageCard.jsx';
import Loader from '../../components/Loader.jsx';
import {
  clearSearch,
  searchImages,
  selectImagesError,
  selectIsSearching,
  selectSearchQuery,
  selectSearchResults,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setViewMode,
} from './imageSlice.js';

export default function SearchImages() {
  const dispatch = useDispatch();

  const [localQuery, setLocalQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    dateRange: '',
    fileType: '',
  });

  const searchResults = useSelector(selectSearchResults);
  const searchQuery = useSelector(selectSearchQuery);
  const isSearching = useSelector(selectIsSearching);
  const error = useSelector(selectImagesError);

  // Debounced search function
  const debounceSearch = useCallback(
    (() => {
      let timeoutId;
      return query => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim()) {
            dispatch(
              searchImages({
                query: query.trim(),
                params: filters,
              })
            );
          } else {
            dispatch(clearSearch());
          }
        }, 500);
      };
    })(),
    [dispatch, filters]
  );

  // Handle search input
  const handleSearchInput = e => {
    const value = e.target.value;
    setLocalQuery(value);
    dispatch(setSearchQuery(value));
    debounceSearch(value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setLocalQuery('');
    dispatch(clearSearch());
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (searchQuery.trim()) {
      dispatch(
        searchImages({
          query: searchQuery,
          params: newFilters,
        })
      );
    }
  };

  // Handle view mode change
  const handleViewModeChange = mode => {
    dispatch(setViewMode(mode));
  };

  // Handle sort change
  const handleSortChange = (sortBy, sortOrder) => {
    dispatch(setSortBy(sortBy));
    dispatch(setSortOrder(sortOrder));
    handleFilterChange('sortBy', sortBy);
    handleFilterChange('sortOrder', sortOrder);
  };

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Sync local query with redux state
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto lg:px-4 lg:py-6 ">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Images</h1>
            <p className="text-gray-600">Find your images quickly and easily</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 lg:p-6  mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search images by name..."
                value={localQuery}
                onChange={handleSearchInput}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {localQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
              showFilters
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={e => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                  <option value="updatedAt">Last Modified</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={e => handleFilterChange('sortOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>

              {/* File Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                <select
                  value={filters.fileType}
                  onChange={e => handleFilterChange('fileType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/gif">GIF</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={e => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Status */}
      {searchQuery && (
        <div className="mb-6">
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Search className="h-4 w-4" />
              <span className="font-medium">
                {isSearching ? 'Searching...' : `Search results for "${searchQuery}"`}
              </span>
              {!isSearching && searchResults.length > 0 && (
                <span className="text-blue-600">
                  ({searchResults.length} {searchResults.length === 1 ? 'result' : 'results'})
                </span>
              )}
            </div>
            <button
              onClick={handleClearSearch}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      )}

      {/* No Results */}
      {!isSearching && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Search Results */}
      {!isSearching && searchResults.length > 0 && (
        <div className="space-y-6">
          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(image => (
              <ImageCard
                key={image._id}
                image={image}
                showActions={true}
                className="transform hover:scale-105 transition-all duration-200"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State (No search query) */}
      {!searchQuery && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
          <p className="text-gray-600">
            Enter a search term above to find your images quickly and easily.
          </p>
        </div>
      )}
    </div>
  );
}
