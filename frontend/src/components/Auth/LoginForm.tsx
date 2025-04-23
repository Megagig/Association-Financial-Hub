// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { useNavigate, Link } from 'react-router-dom';

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '../ui/card';

// export function LoginForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login, showToast } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const redirectPath = await login(email, password);
//       showToast({
//         message: 'Login successful!',
//         type: 'success',
//       });

//       // Used replace instead of push to prevent back button issues
//       navigate(redirectPath, { replace: true });
//     } catch (error) {
//       showToast({
//         message: error instanceof Error ? error.message : 'Login failed',
//         type: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-2">
//       <Card className="w-full max-w-md shadow-lg border-0 -mt-24 bg-green-500">
//         <CardHeader className="space-y-1 pb-6">
//           <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="text-blue-600"
//             >
//               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//               <circle cx="12" cy="7" r="4" />
//             </svg>
//           </div>
//           <CardTitle className="text-2xl font-bold text-center">
//             Sign in to your account
//           </CardTitle>
//           <CardDescription className="text-center">
//             Enter your credentials to access your dashboard
//           </CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium">
//                 Email address
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="example@alumni.org"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="h-10 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="password" className="text-sm font-medium">
//                   Password
//                 </Label>
//                 <a
//                   href="#"
//                   className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Forgot password?
//                 </a>
//               </div>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="h-10 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
//               <div className="text-sm font-medium text-gray-700">
//                 Demo accounts:
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 mt-2">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
//                   <span>Admin: admin@example.com / password</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
//                   <span>Member: member@example.com / password</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col">
//             <Button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 h-12 font-medium"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Signing in...
//                 </span>
//               ) : (
//                 'Sign in'
//               )}
//             </Button>
//             <p className="text-center text-sm text-gray-500 mt-4">
//               Don't have an account?{' '}
//               <Link
//                 to="/register"
//                 className="text-blue-600 hover:text-blue-800 font-medium"
//               >
//                 Create one
//               </Link>
//             </p>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// }

// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { useNavigate, Link } from 'react-router-dom';

// export function LoginForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login, showToast } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const redirectPath = await login(email, password);
//       showToast({
//         message: 'Login successful!',
//         type: 'success',
//       });

//       // Used replace instead of push to prevent back button issues
//       navigate(redirectPath, { replace: true });
//     } catch (error) {
//       showToast({
//         message: error instanceof Error ? error.message : 'Login failed',
//         type: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-[1400px] md:max-w-4xl  mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="flex flex-col md:flex-row">
//             {/* Left side - Brand/Welcome area */}
//             <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white md:w-5/15 p-6 md:p-10 flex flex-col justify-between">
//               <div>
//                 <div className="mb-8">
//                   <h1 className="text-3xl font-bold mb-3">Welcome Back</h1>
//                   <div className="w-16 h-1 bg-blue-300 rounded-full"></div>
//                 </div>
//                 <p className="text-lg text-blue-100 mb-8">
//                   Sign in to continue your experience with our platform.
//                 </p>

//                 <div className="space-y-5 text-sm md:text-base text-blue-100">
//                   <div className="flex items-center">
//                     <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full mr-3">
//                       <svg
//                         className="w-5 h-5"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
//                       </svg>
//                     </div>
//                     <span>Access your personalized dashboard</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full mr-3">
//                       <svg
//                         className="w-5 h-5"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                           clipRule="evenodd"
//                         ></path>
//                       </svg>
//                     </div>
//                     <span>Manage your profile and settings</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full mr-3">
//                       <svg
//                         className="w-5 h-5"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
//                       </svg>
//                     </div>
//                     <span>Access exclusive premium content</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-8 pt-8 border-t border-blue-500 border-opacity-30">
//                 <p className="text-blue-200 mb-3">Don't have an account yet?</p>
//                 <Link
//                   to="/register"
//                   className="inline-block text-white border border-blue-300 rounded-lg px-6 py-3 font-medium hover:bg-white hover:text-blue-700 transition-colors duration-200"
//                 >
//                   Create Account
//                 </Link>
//               </div>
//             </div>

//             {/* Right side - Form */}
//             <div className="md:w-3/5 p-6 md:p-10">
//               <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
//                 <p className="text-gray-500 mt-2">
//                   Enter your credentials to access your account
//                 </p>
//               </div>

//               <form className="space-y-6" onSubmit={handleSubmit}>
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-gray-700 font-medium">
//                     Email Address
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="example@alumni.org"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <Label
//                       htmlFor="password"
//                       className="text-gray-700 font-medium"
//                     >
//                       Password
//                     </Label>
//                     <a
//                       href="#"
//                       className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                     >
//                       Forgot password?
//                     </a>
//                   </div>
//                   <Input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
//                   <div className="text-sm font-medium text-gray-700 mb-2">
//                     Demo accounts:
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
//                       <span>Admin: admin@example.com / password</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
//                       <span>Member: member@example.com / password</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pt-2">
//                   <Button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <span className="flex items-center justify-center">
//                         <svg
//                           className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Signing in...
//                       </span>
//                     ) : (
//                       'Sign in'
//                     )}
//                   </Button>
//                 </div>

//                 <div className="text-center text-sm text-gray-500 mt-4">
//                   <div className="flex items-center justify-center mb-2">
//                     <svg
//                       className="w-4 h-4 text-gray-400 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                         clipRule="evenodd"
//                       ></path>
//                     </svg>
//                     Secured by industry-standard encryption
//                   </div>
//                   <div>
//                     <a href="#" className="text-blue-600 hover:underline">
//                       Terms of Service
//                     </a>{' '}
//                     and{' '}
//                     <a href="#" className="text-blue-600 hover:underline">
//                       Privacy Policy
//                     </a>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useNavigate, Link } from 'react-router-dom';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectPath = await login(email, password);
      showToast({
        message: 'Login successful!',
        type: 'success',
      });

      // Used replace instead of push to prevent back button issues
      navigate(redirectPath, { replace: true });
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Login failed',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1900px] mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Brand/Welcome area */}
          <div className="bg-blue-600 text-white md:w-5/12 p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
                <div className="w-16 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-lg text-white mb-8">
                Sign in to continue your journey with us.
              </p>

              <div className="space-y-5">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3"
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
                    className="w-5 h-5 mr-3"
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
                    className="w-5 h-5 mr-3"
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
            </div>

            <div className="mt-8 pt-6 border-t border-blue-500 border-opacity-30">
              <p className="text-blue-100 mb-3">Don't have an account?</p>
              <Link
                to="/register"
                className="inline-block text-white border border-white rounded-lg px-6 py-2 hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-7/12 p-6 md:p-10 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
                <p className="text-gray-500 mt-2">
                  Enter your credentials to access your account
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@alumni.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 font-medium"
                    >
                      Password
                    </Label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Demo accounts:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Admin: admin@example.com / password</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span>Member: member@example.com / password</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
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
                        Signing in...
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500 mt-4">
                  <div className="flex items-center justify-center mb-2">
                    <svg
                      className="w-4 h-4 text-gray-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Secured by industry-standard encryption
                  </div>
                  <div>
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
