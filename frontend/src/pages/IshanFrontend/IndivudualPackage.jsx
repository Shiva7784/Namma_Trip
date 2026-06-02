import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "../../components/Navbar/Navbar";
import Spinner from "../../components/spinner/spinner";
import Footer from "../../components/Footer/Footer";
import TourBot from "./TourBot";

const IndivudualPackage = () => {
    const { id } = useParams();
    const [tourPackage, setTourPackage] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const url=import.meta.env.BACKEND_URL;

    useEffect(() => {
        const fetchIndividualPackage = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(url+`/tourPackage/get/${id}`);
                setTourPackage(response.data.package);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchIndividualPackage();
    }, [id]);

    const handleBookNow = () => {
        navigate('/book/${id}', {
            state: {
                data: {
                    packageId: tourPackage.packageId,
                    packageName: tourPackage.package_Title,
                    packagePrice: tourPackage.packagePrice,
                }
            }
        });
    };

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <div className="container mx-auto pl-10 pr-10 bg-gray-100 flex-grow">
                        {loading ? (
                            <Spinner />
                        ) : (
                            <>
                                <h1 className="text-4xl font-bold text-left mb-10 mt-28">{tourPackage.package_Title}</h1>
                                <div className="flex flex-col md:flex-row items-start justify-between pb-10 relative">
                                    <img
                                        src={url+`/TourPackageImages/${tourPackage.pImage}`}
                                        alt={tourPackage.package_Title}
                                        className="w-full md:w-1/2 h-auto rounded-lg shadow-lg"
                                    />
                                    <div className="mt-6 md:mt-0 md:ml-8 pr-10 text-justify">
                                        <p className="text-lg mb-8"><strong>Package Category:</strong> {tourPackage.pCategory}</p>
                                        <p className="text-lg mb-8 break-words whitespace-normal">
                                            <strong>Description:<br /><br /></strong>
                                            {tourPackage.packageDes.split('\n').map((paragraph, index) => (
                                                <span key={index}>
                                                    {paragraph}
                                                    <br />
                                                </span>
                                            ))}
                                        </p>
                                        <p className="text-lg mb-8"><strong>Included Destinations:</strong> {tourPackage.pDestination}</p>
                                        <p className="text-lg mb-8"><strong>Duration:</strong> {tourPackage.pDays} days</p>
                                        <p className="text-lg"><strong>Price:</strong> INR {parseFloat(tourPackage.packagePrice).toFixed(2)} Per Person</p>
                                        <button className="bg-blue-600 hover:bg-red-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg mt-4 float-right transition duration-300 ease-in-out"
                                            onClick={handleBookNow}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                                <TourBot />
                            </>
                        )}
                    </div>
                    <Footer />
                </div>
            )}
        </div>
    );
}

export default IndivudualPackage;
