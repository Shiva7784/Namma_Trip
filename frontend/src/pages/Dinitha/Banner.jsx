import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MainComponent = () => {
  const [packages, setPackages] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await axios.get(url+'/tourPackage' , {
          withCredentials: true,
        });

        if (response.data && response.data.length > 0) {
          setPackages(response.data);
          setShowToggle(true); 
        } else {
          console.log('No tour packages found.');
        }
      } catch (error) {
        console.error('Error fetching tour packages:', error);
      }
    };

    fetchPackageData();
  }, []);

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  const toggleBanner = () => {
    setShowBanner((prev) => !prev);
  };

  const handleDeletePreferences = async () => {
    try {
      await axios.delete(url+'/api/user/preferences', { withCredentials: true });
      toast.success('You will no longer see preference-based ads.');
      setShowBanner(false); 
      setPackages([]); 
      console.log('Preferences deleted successfully.');
    } catch (error) {
      console.error('Error deleting preferences:', error);
    }
  };

  return (
    <div className="relative">
      {showBanner && packages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
          <div className="flex flex-col">
            <div className="flex overflow-x-auto whitespace-nowrap py-2 p-2">
              {packages.map((packageData) => (
                <Link key={packageData._id} to={`/tour-packages/${packageData._id}`}>
                  <div className="inline-block w-60 mx-2 bg-white text-black rounded-lg p-4 shadow-lg">
                    <img 
                      src={url+`/TourPackageImages/${packageData.pImage}`}
                      alt={packageData.package_Title} 
                      className="w-full h-24 object-cover rounded-md mb-2" 
                    />
                    <h2 className="text-sm font-bold whitespace-normal">{packageData.package_Title}</h2>
                    <p className="text-xs">{packageData.packageDes.slice(0, 30)}...</p>
                    <p className="mt-1">Price: INR {packageData.packagePrice}</p>
                    <p className="mt-1">Days: {packageData.pDays}</p>
                    <p className="mt-1">Category: {packageData.pCategory.slice(0, 20)}</p>
                    <p className="mt-1">Destination: {packageData.pDestination.slice(0, 20)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button 
                onClick={handleCloseBanner} 
                className="absolute top-2 right-2 text-xl font-semibold text-black"
              >
                &times;
              </button>
              <button 
                onClick={handleDeletePreferences} 
                className="bg-red-600 text-white rounded-lg px-4 py-2 m-2 hover:bg-red-700 transition duration-200"
              >
                Remove preference based Ads
              </button>
            </div>
          </div>
        </div>
      )}

      {showToggle && !showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10 border border-gray-100 text-gray-700 p-2 flex justify-center items-center shadow-lg rounded-t-lg cursor-pointer" onClick={toggleBanner}>
          <span className="text-sm">Recommended Tour Packages</span>
          <span className="ml-2">&#8593;</span>
        </div>
      )}
    </div>
  );
};

export default MainComponent;
