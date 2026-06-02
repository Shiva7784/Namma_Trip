import { useState } from 'react';
import axios from 'axios';
import AddDestinationValidation from './AddDestinationValidation'; 
import { useNavigate } from 'react-router-dom';

function AddDestination() {
    const [destinationID, setDestinationID] = useState("");
    const [dTitle, setDTitle] = useState("");
    const [dDescription, setDDescription] = useState("");
    const [dThumbnail, setDThumbnail] = useState(null);
    const [dExtImage, setDExtImage] = useState("");
    const [dDistrict, setDDistrict] = useState("");
    const [dProvince, setDProvince] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const url=import.meta.env.BACKEND_URL;

    // Karnataka provinces and districts
    const provinces = [
        "Western", "Central", "Southern", "Northern", "Eastern",
        "North Western", "North Central", "Uva", 
    ];

    const districts = {
        Western: [
            "Bengaluru Urban",
            "Bengaluru Rural",
            "Ramanagara",
            "Tumakuru",
            "Chikkaballapur",
            "Kolar",
            "Bidadi"
        ],
        Central: [
            "Chitradurga",
            "Davangere",
            "Shivamogga",
            "Chikkamagaluru",
            "Hassan"
        ],
        Southern: [
            "Mysuru",
            "Mandya",
            "Chamarajanagar",
            "Kodagu"
        ],
        Northern: [
            "Ballari",
            "Bidar",
            "Kalaburagi",
            "Raichur",
            "Yadgir",
            "Koppal",
            "Vijayapura",
            "Bagalkot",
            "Belagavi",
            "Dharwad",
            "Gadag",
            "Haveri"
        ],
        Eastern: [
            "Chikkaballapur",
            "Kolar"
        ],
        Uva: [
            "Uttara Kannada",
            "Dakshina Kannada",
            "Udupi"
        ],
    };
    

    // Handle province selection and update district options
    function handleProvinceChange(e) {
        setDProvince(e.target.value);
        setDDistrict(""); // Reset district when province changes
    }

    function handleThumbnailChange(e) {
        setDThumbnail(e.target.files[0]); // Handle file selection for thumbnail
    }

    function addDestination(e) {
        e.preventDefault();

        const formData = new FormData(); // Create a new FormData object to send the file and text fields
        formData.append("destinationID", destinationID);
        formData.append("dTitle", dTitle);
        formData.append("dDescription", dDescription);
        formData.append("dThumbnail", dThumbnail);
        formData.append("dExtImage", dExtImage);
        formData.append("dDistrict", dDistrict);
        formData.append("dProvince", dProvince);
        formData.append("longitude", longitude);
        formData.append("latitude", latitude);

        // Perform validation before submitting
        const validationErrors = AddDestinationValidation(
            destinationID,
            dTitle,
            dDescription,
            dThumbnail,
            dExtImage,
            dDistrict,
            dProvince,
            longitude,
            latitude
        );

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios.post(url+"/destination/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Set headers for file upload
            },
        })
            .then(() => {
                alert("Destination Added Successfully");
                navigate("/dashboard"); // Redirect to the view destinations page
            })
            .catch((err) => {
                alert(err);
            });

        console.log(formData);
    }

    return (
        <div className="flex flex-col min-h-screen">
            
            <main className="flex-grow pt-16 px-4 md:px-8 lg:px-16">
                <form onSubmit={addDestination} className="max-w-lg mx-auto border border-gray-300 p-4 rounded-lg bg-white">
                    <h1 className="text-3xl font-bold mb-7 text-gray-800">Add New Destination</h1>

                    <div className="mb-8">
                        <label htmlFor="destinationID" className="block mb-2 text-l font-medium text-gray-900">Destination ID</label>
                        <input
                            type="text"
                            id="destinationID"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(e) => setDestinationID(e.target.value)}
                            required
                        />
                        {errors.destinationID && <p className="text-red-500 text-sm">{errors.destinationID}</p>}
                    </div>

                    <div className="mb-8">
                        <label htmlFor="dTitle" className="block mb-2 text-l font-medium text-gray-900">Title</label>
                        <input
                            type="text"
                            id="dTitle"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(e) => setDTitle(e.target.value)}
                            required
                        />
                        {errors.dTitle && <p className="text-red-500 text-sm">{errors.dTitle}</p>}
                    </div>

                    <div className="mb-8">
                        <label htmlFor="dDescription" className="block mb-2 text-l font-medium text-gray-900">Description</label>
                        <textarea
                            id="dDescription"
                            rows="4"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setDDescription(e.target.value)}
                            required
                        ></textarea>
                        {errors.dDescription && <p className="text-red-500 text-sm">{errors.dDescription}</p>}
                    </div>

                    <div className="mb-8">
                        <label htmlFor="dThumbnail" className="block mb-2 text-l font-medium text-gray-900">Thumbnail Image</label>
                        <input
                            type="file"
                            id="dThumbnail"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={handleThumbnailChange}
                            required
                        />
                        {errors.dThumbnail && <p className="text-red-500 text-sm">{errors.dThumbnail}</p>}
                    </div>

                    <div className="mb-8">
                        <label htmlFor="dExtImage" className="block mb-2 text-l font-medium text-gray-900">Things to do</label>
                        <textarea
                            type="text"
                            id="dExtImage"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(e) => setDExtImage(e.target.value)}
                            required
                        ></textarea>
                        {errors.dExtImage && <p className="text-red-500 text-sm">{errors.dExtImage}</p>}
                    </div>

                    {/* Province Dropdown */}
                    <div className="mb-8">
                        <label htmlFor="dProvince" className="block mb-2 text-l font-medium text-gray-900">Province</label>
                        <select
                            id="dProvince"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={dProvince}
                            onChange={handleProvinceChange}
                            required
                        >
                            <option value="">Select Province</option>
                            {provinces.map((province) => (
                                <option key={province} value={province}>
                                    {province}
                                </option>
                            ))}
                        </select>
                        {errors.dProvince && <p className="text-red-500 text-sm">{errors.dProvince}</p>}
                    </div>

                    {/* District Dropdown */}
                    <div className="mb-8">
                        <label htmlFor="dDistrict" className="block mb-2 text-l font-medium text-gray-900">District</label>
                        <select
                            id="dDistrict"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={dDistrict}
                            onChange={(e) => setDDistrict(e.target.value)}
                            required
                            disabled={!dProvince}
                        >
                            <option value="">Select District</option>
                            {dProvince && districts[dProvince]?.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                        {errors.dDistrict && <p className="text-red-500 text-sm">{errors.dDistrict}</p>}
                    </div>

                    {/* Longitude and Latitude Fields */}
                    <div className="mb-8">
                        <label htmlFor="longitude" className="block mb-2 text-l font-medium text-gray-900">Longitude</label>
                        <input
                            type="text"
                            id="longitude"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(e) => setLongitude(e.target.value)}
                            required
                        />
                        {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude}</p>}
                    </div>

                    <div className="mb-8">
                        <label htmlFor="latitude" className="block mb-2 text-l font-medium text-gray-900">Latitude</label>
                        <input
                            type="text"
                            id="latitude"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(e) => setLatitude(e.target.value)}
                            required
                        />
                        {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude}</p>}
                    </div>

                    <button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add Destination</button>
                </form>
            </main>
        </div>
    );
}

export default AddDestination;
