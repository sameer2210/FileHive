// src/pages/Signup.jsx
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader.jsx';
import { clearError, resetOtp, sendOtp, signupUser, verifyOtp } from '../features/auth/authSlice.js';

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Signup form, 2: OTP verification
  const [otp, setOtp] = useState('');

  const { isLoading, error, isAuthenticated, otpStatus, otpError, isVerified } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors, isValid }, watch, getValues } = useForm({
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    dispatch(clearError());
    dispatch(resetOtp());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && isVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isVerified, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (otpError) {
      toast.error(otpError);
      dispatch(resetOtp());
    }
  }, [error, otpError, dispatch]);

  const onSubmitDetails = async (data) => {
    try {
      await dispatch(sendOtp(data)).unwrap();
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      // Error handled by useEffect
    }
  };

  const onSubmitOtp = async () => {
    try {
      const email = getValues('email');
      await dispatch(verifyOtp({ email, otp })).unwrap();
      toast.success('Email verified!');

      // Now proceed with signup
      const { confirmPassword, ...userData } = getValues();
      await dispatch(signupUser(userData)).unwrap();
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Error handled by useEffect
    }
  };

  const formValues = watch();
  const isFormValid = isValid && formValues.name && formValues.email && formValues.password && formValues.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full space-y-2">
        <div className="rounded shadow-2xl font-mono p-8 mt-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-sm text-gray-600">Join FileHive and start organizing your files</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-4 mt-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: 'Name can only contain letters and spaces',
                      },
                    })}
                    className={`block w-full pl-10 pr-3 py-2 border-b-3 rounded focus:outline-none duration-200 ${
                      errors.name
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                    className={`block w-full pl-10 pr-3 py-2 border-b-3 rounded focus:outline-none duration-200 ${
                      errors.email
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message:
                          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                      },
                    })}
                    className={`block w-full pl-10 pr-3 py-2 border-b-3 rounded focus:outline-none duration-200 ${
                      errors.password
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Create a strong password"
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
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value =>
                        value === getValues('password') || 'Passwords do not match',
                    })}
                    className={`block w-full pl-10 pr-3 py-2 border-b-3 rounded focus:outline-none duration-200 ${
                      errors.confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button for Step 1 */}
              <div>
                <button
                  type="submit"
                  disabled={!isFormValid || otpStatus === 'loading' || isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                    !isFormValid || otpStatus === 'loading' || isLoading
                      ? 'bg-gray-800 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {otpStatus === 'loading' || isLoading ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 mt-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="block w-full px-3 py-2 border-b-3 rounded focus:outline-none duration-200 border-gray-300 bg-white hover:border-gray-400"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>

              {/* Submit Button for Step 2 */}
              <div>
                <button
                  onClick={onSubmitOtp}
                  disabled={otp.length !== 6 || otpStatus === 'loading' || isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                    otp.length !== 6 || otpStatus === 'loading' || isLoading
                      ? 'bg-gray-800 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {otpStatus === 'loading' || isLoading ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Resend OTP Link */}
              <p className="text-sm text-center">
                Didn't receive OTP?{' '}
                <button
                  onClick={() => onSubmitDetails(getValues())}
                  className="text-teal-600 hover:underline"
                >
                  Resend
                </button>
                <p className="text-sm bg-gray-100 rounded p-1 text-center">
                 ! OTP works only in creator account.(Domain Error)
                </p>
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-800">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-teal-600 hover:teal-purple-500 transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>
            By creating an account, you agree to our{' '}
            <a href="#" className="text-teal-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-teal-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}