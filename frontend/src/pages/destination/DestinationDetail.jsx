import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Map from "./Map";
import { Link } from "react-router-dom";

const WEATHER_API_KEY = "c4402a459f61c6974a9b5c47e334105a";

export default function DestinationDetail() {
  const [destination, setDestination] = useState(null);
  const [weather, setWeather] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [mapCoords, setMapCoords] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packages, setPackages] = useState([]);
  const url=import.meta.env.BACKEND_URL;

  // Fetch destination details and equipment recommendations
  const fetchDestination = async (id) => {
    try {
      const response = await axios.get(
        url+`/destination/get/${id}`
      );
      const destinationData = response.data.destination;
      setDestination(destinationData);

      const lat = destinationData.latitude;
      const lon = destinationData.longitude;

      // Fetch weather data
      const weatherResponse = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat: lat,
            lon: lon,
            appid: WEATHER_API_KEY,
            units: "metric",
          },
        }
      );
      setWeather(weatherResponse.data);

      // Fetch equipment recommendations
      const equipmentResponse = await axios.get(
        url+`/equipment/recommend/${destinationID}`
      );
      setEquipment(equipmentResponse.data.equipment);

      // Fetch relevant tour packages for this destination
      const packagesResponse = await axios.get(
        url+`/destination/byDestination/${destinationID}`
      );
      setPackages(packagesResponse.data.packages);


      // Set map coordinates
      setMapCoords([lat, lon]);

      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error fetching destination details"
      );
      setLoading(false);
    }
  };

  // Get ID from URL
  const destinationID = window.location.pathname.split("/").pop();

  useEffect(() => {
    fetchDestination(destinationID);
  }, [destinationID]);

  if (loading)
    return (
      <p className="text-center text-gray-600">
        Loading destination details...
      </p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <br></br><br></br><br></br>
      <main className="flex-grow p-12">
        {destination ? (
          <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            {/* Destination Image */}
            <img
              src={url+`/DestinationImages/${destination.dThumbnail}`}
              alt="Destination Thumbnail"
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              {/* Destination Title */}
              <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                {destination.dTitle}
              </h1>

              {/* Destination Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {destination.dDescription}
              </p>

              {/* Things to Do Section */}
              {destination.dExtImage && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Things to Do:
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {destination.dExtImage}
                  </p>
                </div>
              )}

              {/* Destination Info */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Geographical Details
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>District:</strong> {destination.dDistrict}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Province:</strong> {destination.dProvince}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Longitude:</strong> {destination.longitude}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Latitude:</strong> {destination.latitude}
                  </p>
                </div>

                {/* Weather Section */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Weather Forecast
                  </h2>
                  {weather ? (
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Temperature:</strong> {weather.main.temp} °C
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Condition:</strong>{" "}
                        {weather.weather[0].description}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Humidity:</strong> {weather.main.humidity} %
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Wind Speed:</strong> {weather.wind.speed} m/s
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      Weather information not available.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Related Tour Packages
                </h2>
                <div className="max-w-full mx-auto mb-8">
                  <div
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md"
                    style={{
                      overflowX: packages.length > 4 ? "auto" : "hidden", 
                      whiteSpace: "nowrap", 
                    }}
                  >
                    {packages.length > 0 ? (
                      <ul
                        className="inline-flex gap-4"
                        style={{
                          paddingBottom: "10px",
                        }}
                      >
                        {packages.map((pkg) => (
                          <li
                            key={pkg._id}
                            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 flex-shrink-0"
                            style={{
                              width: "250px",
                            }}
                          >
                            {pkg.pImage && (
                              <div className="h-40 w-full overflow-hidden relative">
                                <img
                                  src={url+`/TourPackageImages/${pkg.pImage}`}
                                  alt={pkg.title}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <div className="p-3 flex flex-col">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                {pkg.package_Title}
                              </h3>
                              <div className="flex justify-between items-center mt-auto">
                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                  LKR. {pkg.packagePrice} <br/> per person
                                </span>
                                <Link
                                  to={`/tour-packages/${pkg._id}`}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded-full transition duration-300"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 text-center">
                        No tour packages available for this destination.
                      </p>
                    )}
                  </div>
                </div>

              </div>

              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Recommended Equipment
              </h2>
              <div className="max-w-full mx-auto mb-8">
                <div
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md"
                  style={{
                    overflowX: equipment.length > 4 ? "auto" : "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {equipment.length > 0 ? (
                    <ul
                      className="inline-flex gap-4"
                      style={{
                        paddingBottom: "10px", // Adds some space to prevent content from touching the edge
                      }}
                    >
                      {equipment.map((item) => (
                        <li
                          key={item._id}
                          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 flex-shrink-0"
                          style={{
                            width: "250px", // Fixed width for each item to control the size in the slider
                          }}
                        >
                          {item.equipmentImage && (
                            <div className="h-40 w-full overflow-hidden relative">
                              <img
                                src={url+`/EquipmentImages/${item.equipmentImage}`}
                                alt={item.equipmentName}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <div className="p-3 flex flex-col">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                              {item.equipmentName}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              Essential for your adventure
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                Rs. {item.equipmentPrice}
                              </span>
                              <Link
                                to={`/equipment/${item._id ? item._id : ""}`}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded-full transition duration-300"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 text-center">
                      No equipment recommendations available for this district.
                    </p>
                  )}
                </div>
              </div>


              {/* Map Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Location Map
                </h2>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <Map latitude={mapCoords[0]} longitude={mapCoords[1]} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No details available.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
