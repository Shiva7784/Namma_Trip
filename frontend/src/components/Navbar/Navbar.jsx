import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import logo from '../../assets/clogo.png';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const url = import.meta.env.BACKEND_URL;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      await axios.post(url + '/api/auth/signout', {}, { withCredentials: true });
      setUser(null);
      window.location.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const getFirstName = (firstName) => {
    return firstName || '';
  };

  return (
    <nav className="fixed top-5 left-10 right-10 bg-white shadow-lg rounded-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="w-28 sm:w-32 cursor-pointer rounded-2xl"
              style={{ filter: 'drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))' }}
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center">
          <button
            className="focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-7 h-7 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <div className="hidden sm:flex flex-1 justify-center space-x-6 lg:space-x-8">
          <Link to="/destinations" className="text-gray-700 hover:text-blue-600 transition duration-300 cursor-pointer">
            Destinations
          </Link>
          <Link to="/tour-packages" className="text-gray-700 hover:text-blue-600 transition duration-300 cursor-pointer">
            Tour Packages
          </Link>
          <Link to="/userequipment" className="text-gray-700 hover:text-blue-600 transition duration-300 cursor-pointer">
            Equipments
          </Link>
          <Link to="/user-blog" className="text-gray-700 hover:text-blue-600 transition duration-300 cursor-pointer">
            Blogs
          </Link>
          <Link to="/tickets" className="text-gray-700 hover:text-blue-600 transition duration-300 cursor-pointer">
            Support
          </Link>
        </div>

        {/* User Actions for desktop */}
        <div className="hidden sm:flex items-center space-x-8">
          {user ? (
            <>
              <button
                onClick={() => window.location.replace('/profile')}
                className="text-blue-600 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300 cursor-pointer"
              >
                Hi, {getFirstName(user.firstName)}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-300 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300 cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 ml-2 cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Navbar */}
      {menuOpen && (
        <div className="sm:hidden bg-white rounded-b-2xl shadow-md px-4 pt-2 pb-4 z-50 animate-fade-in-down">
          <div className="flex flex-col space-y-2">
            <Link
              to="/destinations"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 py-2 transition duration-300 cursor-pointer"
            >
              Destinations
            </Link>
            <Link
              to="/tour-packages"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 py-2 transition duration-300 cursor-pointer"
            >
              Tour Packages
            </Link>
            <Link
              to="/userequipment"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 py-2 transition duration-300 cursor-pointer"
            >
              Equipments
            </Link>
            <Link
              to="/user-blog"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 py-2 transition duration-300 cursor-pointer"
            >
              Blogs
            </Link>
            <Link
              to="/tickets"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 py-2 transition duration-300 cursor-pointer"
            >
              Support
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.replace('/profile');
                  }}
                  className="text-blue-600 px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300 cursor-pointer w-full text-left"
                >
                  Hi, {getFirstName(user.firstName)}
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-300 cursor-pointer w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-blue-600 px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300 cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 mt-2 cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
