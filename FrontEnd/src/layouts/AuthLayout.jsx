import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AuthLayout() {
  const { token } = useSelector(state => state.auth);

  // If user is already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
