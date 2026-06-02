/* eslint-disable react/prop-types */
import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';
import toast from 'react-hot-toast';

const GuestRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            toast.error('You are already logged in!'); // Display a toast message
        }
    }, [user]);

    if (user) {
        return <Navigate to="/" replace />;
    }

    // If the user is not logged in, render the requested component (login/signup)
    return children;
};

export default GuestRoute;
