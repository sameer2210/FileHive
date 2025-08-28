// src/pages/Home.jsx
import {
  CloudArrowUpIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: CloudArrowUpIcon,
    title: 'Cloud Storage',
    description: 'Upload and store your images securely in the cloud with unlimited access.',
  },
  {
    icon: FolderIcon,
    title: 'Nested Folders',
    description: 'Organize your files with nested folder structure, just like Google Drive.',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Smart Search',
    description: 'Quickly find your images with our powerful search functionality.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Access',
    description: 'Your data is protected with JWT authentication and user-specific access.',
  },
];

export default function Home() {
  const { token } = useSelector(state => state.auth);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">FileHive</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your personal cloud storage solution. Upload, organize, and manage your images with
            nested folders and powerful search capabilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!token ? (
              <>
                <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white rounded-2xl shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for file management
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Built with modern technologies to provide you with the best cloud storage experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!token && (
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
            <p className="text-gray-600 text-lg mb-8">
              Join thousands of users who trust Drive_Ai for their file storage needs.
            </p>
            <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
              Create Your Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
