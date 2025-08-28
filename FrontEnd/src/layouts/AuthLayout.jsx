import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  const { token } = useSelector(state => state.auth);

  // If user is already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FileHive</h1>
          <p className="text-gray-600">Your personal cloud storage solution</p>
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
