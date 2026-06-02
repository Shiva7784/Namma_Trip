/* eslint-disable react/prop-types */

import Lottie from 'lottie-react';
import ContactAnimation from '../assets/Dinitha/contact.json';
import { Link } from 'react-router-dom'; 

const AccountSuspendedPopup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center relative">
                <Lottie 
                    animationData={ContactAnimation} 
                    loop={true} 
                    style={{ width: '350px', height: '350px', margin: '0 auto' }} 
                />
                <h2 className="text-2xl font-bold mt-4">Your Account is Suspended</h2>
                <p className="mt-2 text-gray-600">Contact support for assistance.</p>
                <Link 
                    to="/tickets"
                    className="mt-4 text-blue-600 underline hover:text-blue-700 block"
                >
                    Go to Support Page
                </Link>
                <button 
                    onClick={onClose} 
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AccountSuspendedPopup;
