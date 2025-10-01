// import { FolderOpen, Home, LogOut, User } from 'lucide-react';
// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { logout } from '../features/auth/authSlice.js';

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const { token, user } = useSelector(state => state.auth);

//   const handleLogout = async () => {
//     try {
//       dispatch(logout());
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   const isActive = path => location.pathname === path;

//   if (!token) return null; // Don't show navbar on auth pages

//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex items-center justify-between">
//           {/* Brand Logo */}
//           <Link
//             to="/"
//             className="flex items-center space-x-2 font-bold text-xl text-teal-600 hover:text-indigo-700 transition-colors"
//           >
//             <FolderOpen className="h-6 w-6" />
//             <span>FileHive</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             <Link
//               to="/"
//               className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
//                 isActive('/')
//                   ? 'bg-indigo-50 text-indigo-700'
//                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//             >
//               <Home className="h-4 w-4" />
//               <span>Home</span>
//             </Link>

//             <Link
//               to="/dashboard"
//               className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
//                 isActive('/dashboard')
//                   ? 'bg-indigo-50 text-indigo-700'
//                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//             >
//               <FolderOpen className="h-4 w-4" />
//               <span>Dashboard</span>
//             </Link>
//           </nav>

//           {/* User Menu */}
//           <div className="flex items-center space-x-4">
//             {/* User Info */}
//             <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
//               <User className="h-4 w-4" />
//               <span className="font-medium">{user?.name || user?.email || 'User'}</span>
//             </div>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
//               title="Logout"
//             >
//               <LogOut className="h-4 w-4" />
//               <span className="hidden sm:block">Logout</span>
//             </button>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               aria-label="Toggle mobile menu"
//             >
//               <div className="w-5 h-5 flex flex-col justify-center items-center">
//                 <span
//                   className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
//                     isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
//                   }`}
//                 ></span>
//                 <span
//                   className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${
//                     isMenuOpen ? 'opacity-0' : 'opacity-100'
//                   }`}
//                 ></span>
//                 <span
//                   className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
//                     isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
//                   }`}
//                 ></span>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
//             <nav className="flex flex-col space-y-2 mt-4">
//               <Link
//                 to="/"
//                 onClick={() => setIsMenuOpen(false)}
//                 className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//                   isActive('/')
//                     ? 'bg-indigo-50 text-indigo-700'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 <Home className="h-4 w-4" />
//                 <span>Home</span>
//               </Link>

//               <Link
//                 to="/dashboard"
//                 onClick={() => setIsMenuOpen(false)}
//                 className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//                   isActive('/dashboard')
//                     ? 'bg-indigo-50 text-indigo-700'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 <FolderOpen className="h-4 w-4" />
//                 <span>Dashboard</span>
//               </Link>

//               <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
//                 <User className="h-4 w-4" />
//                 <span>{user?.name || user?.email || 'User'}</span>
//               </div>
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

import { FolderOpen, Home, LogOut, User } from 'lucide-react';
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
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = path => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/45 backdrop-blur-sm border-b border-gray-300/20">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            className="text-3xl font-black tracking-tight text-gray-900 hover:text-emerald-500 transition-colors"
          >
            FILEHIVE
          </Link>

          {/* Conditional Navigation based on authentication */}
          {token ? (
            /* Authenticated User Navigation */
            <>
              {/* Desktop Navigation - Authenticated */}
              <div className="flex space-x-6">
                <Link
                  to="/"
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-emerald-500' : 'text-gray-700 hover:text-emerald-500'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>

                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-emerald-500'
                      : 'text-gray-700 hover:text-emerald-500'
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <div className="flex items-center space-x-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user?.name || user?.email || 'User'}</span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Mobile Navigation - Authenticated */}
              <div className="md:hidden flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user?.name || user?.email || 'User'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 rounded"
                >
                  Logout
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  <div className="w-5 h-5 flex flex-col justify-center items-center">
                    <span
                      className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                        isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                      }`}
                    ></span>
                    <span
                      className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${
                        isMenuOpen ? 'opacity-0' : 'opacity-100'
                      }`}
                    ></span>
                    <span
                      className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                        isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                      }`}
                    ></span>
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* Unauthenticated User Navigation */
            <>
              {/* Desktop Navigation - Unauthenticated */}
              <div className="hidden md:flex items-center space-x-8">
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
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-emerald-500 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-emerald-500 text-white text-sm font-medium rounded hover:bg-emerald-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>

              {/* Mobile Navigation - Unauthenticated */}
              <div className="md:hidden flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-emerald-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded hover:bg-emerald-600 transition-colors"
                >
                  Sign Up
                </Link>

                {/* Mobile Menu Button for public pages */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  <div className="w-5 h-5 flex flex-col justify-center items-center">
                    <span
                      className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                        isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                      }`}
                    ></span>
                    <span
                      className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${
                        isMenuOpen ? 'opacity-0' : 'opacity-100'
                      }`}
                    ></span>
                    <span
                      className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                        isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                      }`}
                    ></span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200/20">
            <div className="flex flex-col space-y-2 mt-4">
              {token ? (
                /* Mobile Menu - Authenticated */
                <>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                    }`}
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </>
              ) : (
                /* Mobile Menu - Unauthenticated */
                <>
                  <a
                    href="#features"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-500 hover:bg-gray-50/50 rounded-lg transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#services"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-500 hover:bg-gray-50/50 rounded-lg transition-colors"
                  >
                    Services
                  </a>
                  <a
                    href="#about"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-500 hover:bg-gray-50/50 rounded-lg transition-colors"
                  >
                    About
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
