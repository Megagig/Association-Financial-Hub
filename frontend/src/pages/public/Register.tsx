import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RegisterFormData } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  // Use mutation for registration
  const mutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      return response.json();
    },
    onSuccess: async () => {
      showToast({
        message: 'Registration successful! Please log in.',
        type: 'success',
      });
      navigate('/login');
    },
    onError: (error: Error) => {
      showToast({
        message: error.message || 'Registration failed',
        type: 'error',
      });
    },
  });

  // Handle form submission
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto my-10 p-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Brand/Welcome area */}
            <div className="bg-blue-600 text-white md:w-2/5 p-8 flex flex-col justify-center">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold mb-2">Welcome!</h1>
                <div className="w-16 h-1 bg-white rounded"></div>
              </div>
              <p className="text-lg mb-6">
                Create your account and start your journey with us.
              </p>
              <div className="space-y-4 text-sm">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Personalized experience</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Secure account management</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Access to exclusive features</span>
                </div>
              </div>
              <div className="mt-10">
                <p className="text-sm">Already have an account?</p>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-2 text-white border border-white rounded px-4 py-2 hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="md:w-3/5 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create an account
                </h2>
                <p className="text-gray-600 mt-1">
                  Fill in your information to get started
                </p>
              </div>

              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-medium mb-1"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      className={`border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('firstName', {
                        required: 'First name is required',
                      })}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 text-sm font-medium mb-1"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      className={`border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('lastName', {
                        required: 'Last name is required',
                      })}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-1"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-1"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    {...register('confirmPassword', {
                      validate: (val: string) => {
                        if (!val) {
                          return 'Please confirm your password';
                        } else if (watch('password') !== val) {
                          return 'Your passwords do not match';
                        }
                      },
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || mutation.isPending}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    {isSubmitting || mutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>

                <div className="text-sm text-center text-gray-600">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
