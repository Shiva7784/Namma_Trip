import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import searchHandleImg from "../../assets/Ishan/notAvailableImg.png";
import Spinner from "../../components/spinner/spinner";
import toast, { Toaster } from "react-hot-toast";

const AllTourPackages = () => { 
    const [tourPackages, setTourPackages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPackages, setFilteredPackages] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPackages = filteredPackages.slice(startIndex, startIndex + itemsPerPage);

    const [loading, setLoading] = useState(true);
    const url=import.meta.env.BACKEND_URL;

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); 

        return () => clearTimeout(timer);
    }, []);

    const fetchTourPackages = async () => {
        try {
            const response = await axios.get(url+'/tourPackage/');
            setTourPackages(response.data);
            setFilteredPackages(response.data);
        } catch (error) {
            console.error('Error fetching tour packages:', error);
        }
    };

    useEffect(() => {
        fetchTourPackages();

        const interval = setInterval(() => {
            fetchTourPackages();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const deleteTourPackage = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this Tour Package?");
        if(confirmed) {
            try {
                await axios.delete(url+`/tourPackage/delete/${id}`);
                toast.success('Tour Package Deleted Successfully!');
                fetchTourPackages();

            } catch (error) {
                toast.error('Error Deleting Tour Package');
                console.error('Error deleting tour package:', error);
            }
        }
        
    };

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();

        const filtered = tourPackages.filter( (tourPackage) =>
            tourPackage.packageId.toLowerCase().includes(lowerCaseQuery) ||
            tourPackage.package_Title.toLowerCase().includes(lowerCaseQuery) ||
            tourPackage.pDestination.toLowerCase().includes(lowerCaseQuery) ||
            tourPackage.pCategory.toLowerCase().includes(lowerCaseQuery) ||
            tourPackage.pDays.toString().includes(lowerCaseQuery) ||
            tourPackage.packagePrice.toString().includes(lowerCaseQuery)
        );

        setFilteredPackages(filtered);
        setCurrentPage(1);
    }, [searchQuery, tourPackages]);
    

    return (

        <div>
            {loading ? (
                <Spinner />
            ) : (
                <div>
                    <Toaster />
                    <div className="relative bg-gray-100 min-h-screen pt-1">
                        <div className="flex justify-center relative">
                            <div className="flex items-center w-1/2">
                                <input
                                type="text"
                                placeholder="Search for Tour packages"
                                className="flex-grow p-2 pl-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base"
                                style={{ height: '3.5rem' }}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <h1 className='pt-10 pb-10 text-3xl font-semibold text-black text-center'>All listed Tour Packages</h1>

                        {/* tour package list */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-14">
                            {currentPackages.length > 0 ? (
                            currentPackages.map((tPackage, index) => (
                                <div key={index} className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center">
                                    <h2 className="text-lg font-semibold mb-4">{tPackage.packageId}</h2>
                                    <h2 className="text-lg font-semibold mb-4">{tPackage.package_Title}</h2>
                                    <div className="relative w-full h-40 mb-4 overflow-hidden rounded-2xl">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={url+`/TourPackageImages/${tPackage.pImage}`} 
                                            alt="Tour package image"
                                        />
                                    </div>

                                    <p className="text-black-700 text-lg mb-4">
                                        Create Date: {tPackage.pCreateDate}
                                    </p>

                                    <p className="text-black-700 text-lg mb-4">
                                        Category: {tPackage.pCategory}
                                    </p>

                                    <p className="text-black-700 text-lg mb-4">
                                        Destinations: {tPackage.pDestination}
                                    </p>

                                    <p className="text-black-700 text-lg mb-4">
                                        Days: {tPackage.pDays}
                                    </p>

                                    <p className="text-black-700 text-lg">
                                        INR: {(tPackage.packagePrice).toFixed(2)} Per person
                                    </p>

                                    <div className="flex space-x-4 mt-4">
                                        <Link className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center w-28 h-10" 
                                            to={`/dashboard/manageTourPackages/${tPackage._id}`} state={{ packageToEdit : tPackage }}>
                                            Update
                                        </Link>
                                        
                                        <button className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-300 ease-in-out flex items-center justify-center w-28 h-10"
                                            onClick={() => deleteTourPackage(tPackage._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))):(
                                <div className="lg:col-span-3 flex justify-center">
                                    <img
                                        src={searchHandleImg}
                                        alt="No packages available"
                                        className="w-40 h-40"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center mt-8">
                            <button 
                                className={`px-4 py-2 bg-gray-700 text-white rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                onClick={() => setCurrentPage(currentPage - 1)} 
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="mx-2">Page {currentPage} of {totalPages}</span>
                            <button 
                                className={`px-4 py-2 bg-gray-700 text-white rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                onClick={() => setCurrentPage(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>

    )
}
export default AllTourPackages;