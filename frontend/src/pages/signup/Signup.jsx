import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; 
import Lottie from 'lottie-react'; 
import registerAnimation from '../../assets/dinitha/register.json';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    referralCode: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refid = params.get('refid');
    if (refid) {
      setFormData(prevData => ({
        ...prevData,
        referralCode: refid
      }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: "" });

    // Update password strength when password changes
    if (e.target.name === 'password') {
      checkPasswordStrength(e.target.value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = '';
    const lengthRequirement = password.length >= 8;
    const lowercase = /[a-z]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (lengthRequirement && lowercase && uppercase && number && specialChar) {
      strength = 'Strong';
    } else if (lengthRequirement && ((lowercase && uppercase) || (lowercase && number) || (uppercase && number))) {
      strength = 'Medium';
    } else if (lengthRequirement) {
      strength = 'Weak';
    } else {
      strength = 'Too short';
    }

    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate form fields
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (passwordStrength === 'Weak' || passwordStrength === 'Too short') {
      newErrors.password = "Password is too weak.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating your account...');

    try {
      const response = await fetch(url+'/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Registration successful!', { id: toastId });
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.error(data.message || 'Something went wrong!', { id: toastId });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Toaster />
      <div className="flex flex-1">
        <div className="w-1/2 flex items-center justify bg-gray-50">
          <Lottie animationData={registerAnimation} loop={true} className="w-3/4" />
        </div>
        <div className="flex-1 flex justify-center items-center bg-white p-6 lg:py-12 lg:px-16">
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create an account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">First Name</label>
                  <div className="mt-2">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="cursor-text block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-5"
                    />
                    {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
                  <div className="mt-2">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="cursor-text block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-5"
                    />
                    {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="cursor-text block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-5"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="cursor-text block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-5"
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                  {passwordStrength && <p className={`mt-1 text-sm ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                    Password strength: {passwordStrength}
                  </p>}
                </div>
              </div>

              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium leading-6 text-gray-900">Referral Code (Optional)</label>
                <div className="mt-2">
                  <input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    autoComplete="referral-code"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="cursor-text block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-5"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={`cursor-pointer flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Sign up'}
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already a member?{' '}
              <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500 cursor-pointer">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
