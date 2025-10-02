import { FolderOpen, Home, LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice.js';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { token, user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = path => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 hover:text-emerald-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            FILEHIVE
          </Link>

          {token ? (
            /* Authenticated Navigation */
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/')
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>

                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user?.name || user?.email || 'User'}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button - Authenticated */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </>
          ) : (
            /* Unauthenticated Navigation */
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="#services"
                  className="text-sm font-medium text-gray-700 hover:text-emerald-500 transition-colors"
                >
                  Services
                </a>
                <a
                  href="#about"
                  className="text-sm font-medium text-gray-700 hover:text-emerald-500 transition-colors"
                >
                  About
                </a>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="md:hidden flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && token && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-3">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {user?.name || user?.email || 'User'}
              </span>
            </div>

            {/* Navigation Links */}
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive('/')
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <FolderOpen className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 mt-2 text-base font-medium text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu for Unauthenticated Users */}
      {isMenuOpen && !token && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            <a
              href="#services"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
            >
              Services
            </a>
            <a
              href="#about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
            >
              About
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
