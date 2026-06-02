import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function DestinationList() {
    const [destinations, setDestinations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("All");
    const [selectedProvince, setSelectedProvince] = useState("All");
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

    useEffect(() => {
        fetchDestinations();
        const interval = setInterval(() => {
            fetchDestinations();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleThumbnailClick = async (destinationId) => {
        try {
            await axios.put(url+`/destination/${destinationId}/click`);
            navigate(`/destination/${destinationId}`);
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    };

    const handleReadMoreClick = async (destinationId) => {
        try {
            await axios.put(url+`/destination/${destinationId}/click`);
            navigate(`/destination/${destinationId}`);
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
    };

    const handleProvinceChange = (e) => {
        setSelectedProvince(e.target.value);
    };

    const filteredDestinations = destinations.filter(destination =>
        (destination.dTitle.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === "") &&
        (selectedDistrict === "All" || destination.dDistrict === selectedDistrict) &&
        (selectedProvince === "All" || destination.dProvince === selectedProvince)
    );

    const districts = Array.from(new Set(destinations.map(d => d.dDistrict)));
    const provinces = Array.from(new Set(destinations.map(d => d.dProvince)));

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <br></br><br></br>

            <main className="flex-grow pt-16 px-4 md:px-8 lg:px-16">
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder="Search destinations..." 
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="flex-1 flex gap-4">
                        <select 
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            className="p-2 border border-gray-300 rounded-lg flex-grow"
                        >
                            <option value="All">All Districts</option>
                            {districts.map((district, index) => (
                                <option key={index} value={district}>{district}</option>
                            ))}
                        </select>

                        <select 
                            value={selectedProvince}
                            onChange={handleProvinceChange}
                            className="p-2 border border-gray-300 rounded-lg flex-grow"
                        >
                            <option value="All">All Provinces</option>
                            {provinces.map((province, index) => (
                                <option key={index} value={province}>{province}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <br></br>

                <div className="space-y-4">
                    {filteredDestinations.length > 0 ? (
                        filteredDestinations.map(destination => (
                            <div key={destination._id} className="flex border rounded-lg p-6 bg-white shadow-lg transition-transform transform hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
                                <div className="w-1/3">
                                    <img 
                                        src={url+"/DestinationImages/" + destination.dThumbnail} 
                                        alt="Destination Thumbnail" 
                                        className="w-full h-48 object-cover rounded-md cursor-pointer transition-transform transform hover:scale-110"
                                        onClick={() => handleThumbnailClick(destination._id)}
                                    />
                                </div>
                                <div className="w-2/3 pl-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {destination.dTitle}
                                    </h2>
                                    <p className="text-gray-700 dark:text-gray-400 mb-2">
                                        {destination.dDescription.length > 150 
                                            ? destination.dDescription.substring(0, 150) + '...'
                                            : destination.dDescription
                                        }
                                    </p>
                                    <button
                                        onClick={() => handleReadMoreClick(destination._id)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Read more
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No destinations available.</p>
                    )}
                </div>
            </main>
            
            <br></br><br></br>

            <Footer />
        </div>
    );
}
