import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader.jsx';
import { clearError, loginUser } from '../features/auth/authSlice.js';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async data => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  const formValues = watch();
  const isFormValid = isValid && formValues.email && formValues.password;

  return (
    <div className="max-h-screen flex  items-center justify-center bg-gradient-to-br from-gray-100 via-white to-cyan-50 py-6 px-4 sm:px-6 lg:px-6">
      <div className=" mt-16 ">
        <div className="max-w-md w-full space-y-8 font-mono shadow-xl mt-4 ">
          {/* Login Form */}
          <div className=" rounded  px-4">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-teal-600 ">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 ">Welcome back</h2>
              <p className="text-sm text-gray-600">Sign in to your FileHive account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 ">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className={`block w-full pl-10 pr-3 py-2 border-b-3 border-gray-400 hover:border-gray-500 rounded focus:outline-none duration-200${
                      errors.email
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="font-medium">{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className={`block w-full pl-10 pr-3 py-2 border-b-3 rounded border-gray-400 hover:border-gray-500 focus:outline-none duration-200${
                      errors.password
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="font-medium">{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                    !isFormValid || isLoading
                      ? 'bg-gray-800 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-800">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-teal-600 hover:text-teal-500 transition-colors hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-teal-800 mb-2">Demo Credentials</h3>
            <div className="text-xs text-teal-700 space-y-1">
              <p>
                <strong>Email:</strong> demo@gmail.com
              </p>
              <p>
                <strong>Password:</strong> Demo123
              </p>
              <p>
                <strong>Note:</strong> Deployment problem on First time error [Retry]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
