import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/Dinitha/login.json";
import AccountSuspendedPopup from '../../components/Suspended'; 
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [errors, setErrors] = useState({}); // State for error messages
  const navigate = useNavigate(); 
  const url=import.meta.env.BACKEND_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input change
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      await axios.post(url+'/api/auth/signout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    const newErrors = {};

    // Validate form fields
    if (!formData.email) {
      newErrors.email = "Email is required.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set error messages
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Signing in...');
  
    try {
      const response = await fetch(url+"/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      if (data.user.status === 'suspended') {
        await handleLogout();
        setIsSuspended(true);
        toast.error('Your account has been suspended.', { id: toastId });
        setIsSubmitting(false); 
        return; 
      }
  
      toast.success('Login successful!', { id: toastId });
  
      if (data.user.role === 'admin') {
        navigate("/dashboard");
      } else {
        if (!data.user.completedOnboarding) {
          navigate('/onboarding');
        } else {
          navigate("/");
        }
      }
  
      window.location.reload();
  
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setIsSuspended(false); // Close the popup
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster />
      <div className="flex flex-1">
        
        {/* Right side with the login form */}
        <div className="flex-1 flex justify-center items-center bg-white p-6 lg:py-12 lg:px-16">
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-5"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>} {/* Error message */}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-5"
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>} {/* Error message */}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  id="submit"
                  className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-500">
              Not a member?{' '}
              <Link to="/signup" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Left side with Lottie animation */}
        <div className="w-1/2 flex items-center justify-center bg-gray-50">
          <Lottie animationData={loginAnimation} loop={true} className="w-3/4" />
        </div>
        
      </div>

      {isSuspended && <AccountSuspendedPopup onClose={handleClosePopup} />}
    </div>
  );
}

export default Login;
