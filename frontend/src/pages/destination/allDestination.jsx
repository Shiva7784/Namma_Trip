import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AllDestinations() {
    const [destinations, setDestinations] = useState([]);
    const navigate = useNavigate();
    const url=import.meta.env.BACKEND_URL;

    const fetchDestinations = async () => {
        try {
            const response = await axios.get(url+'/destination/');
            setDestinations(response.data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    const deleteDestination = async (destinationID) => {
        if (window.confirm('Are you sure you want to delete this destination?')) {
            try {
                await axios.delete(url+`/destination/delete/${destinationID}`);
                setDestinations(destinations.filter(destination => destination._id !== destinationID));
            } catch (error) {
                console.error('Error deleting destination:', error);
            }
        }
    };

    const editDestination = (destinationID) => {
        navigate(`/edit-destination/${destinationID}`);
    };

    const addDestination = () => {
        navigate('/dashboard/add-destination');
    };

    const DestinationAnalytics = () => {
        navigate('/analytics'); 
    };

    useEffect(() => {
        fetchDestinations();

        const interval = setInterval(() => {
            fetchDestinations();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow pt-16 px-4 md:px-8 lg:px-16"> 
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <center><h1 className="text-2xl font-bold mb-4">Destinations</h1></center>

                    <div className="flex justify-between mb-4">
                        <button 
                            onClick={addDestination}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                        >
                            Add Destination
                        </button>

                        <button 
                            onClick={DestinationAnalytics}
                            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
                        >
                            Analytics
                        </button>
                    </div>

                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Thumbnail</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Creation Date</th>
                                <th scope="col" className="px-6 py-3">Clicks</th> 
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {destinations.map((destination) => (
                                <tr key={destination._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="p-4">
                                        <img src={url+`/DestinationImages/${destination.dThumbnail}`} alt="Destination Thumbnail" className="w-16 md:w-32 max-w-full max-h-full" />
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {destination.dTitle}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {destination.dDescription}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {new Date(destination.creationDate).toLocaleDateString()} 
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-center">
                                        {destination.clickCount} 
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-center">
                                        <button 
                                            onClick={() => editDestination(destination._id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteDestination(destination._id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}