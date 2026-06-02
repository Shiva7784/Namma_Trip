import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react'; 
import NotFoundAnimation from '../../assets/Dinitha/404error.json';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Lottie 
                animationData={NotFoundAnimation} 
                loop 
                style={{ width: '400px', height: '400px' }} 
            />
            <h1 className="text-4xl font-bold mt-4">Oops! Page Not Found</h1>
            <p className="mt-2 text-lg text-gray-600">The page you are looking for does not exist.</p>
            <button 
                onClick={handleGoHome} 
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Go to Home
            </button>
        </div>
    );
};

export default NotFound;
