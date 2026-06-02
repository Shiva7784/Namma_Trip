/* eslint-disable react/prop-types */
import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';
import { toast } from 'react-hot-toast';
import Spinner from '../components/spinner/spinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, error, isAdmin,  } = useContext(UserContext);
console.log(isAdmin)
  useEffect(() => {
    if (loading) return;

    if (error) {
      toast.error('Error loading user data. Please try again later.');
    } 
  }, [loading, error, adminOnly, isAdmin, ]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Navigate to="/error" replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin()) {
    toast.error('You do not have permission to access this page.'); 
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
