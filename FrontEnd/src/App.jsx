import { Suspense, lazy, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import Loader from "./components/Loader.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Protected
function ProtectedRoute({ children }) {
  const { token } = useSelector(state => state.auth);
  if (!token) return <Navigate to="/home" replace />;
  return children;
}

// Public
function PublicRoute({ children }) {
  const { token } = useSelector(state => state.auth);
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {

  // Warm up backend here
  useEffect(() => {
    axiosInstance.get("/health").catch(() => {});
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/home" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
