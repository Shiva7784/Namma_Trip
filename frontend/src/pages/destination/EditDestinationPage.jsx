import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import AddDestinationValidation from '../../pages/destination/AddDestinationValidation';

export default function EditDestinationPage() {
    const [destination, setDestination] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const url=import.meta.env.BACKEND_URL;

    const [formData, setFormData] = useState({
        destinationID: '',
        dTitle: '',
        dDescription: '',
        dThumbnail: '', 
        dExtImage: '',
        dDistrict: '',
        dProvince: '',
        longitude: '',
        latitude: '',
        thumbnailFile: null 
    });

    const [provinces, setProvinces] = useState([
        "Western",
        "Central",
        "Southern",
        "Northern",
        "Eastern",
        "North Western",
        "North Central",
        "Uva"
      ]);
      
      const [districts, setDistricts] = useState({
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
        "North Western": [],
        "North Central": []
      });


    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const response = await axios.get(url+`/destination/get/${id}`);
                if (response.data.status === 'Destination fetched') {
                    const destinationData = response.data.destination;
                    setDestination(destinationData);
                    setFormData({
                        destinationID: destinationData.destinationID,
                        dTitle: destinationData.dTitle,
                        dDescription: destinationData.dDescription,
                        dThumbnail: destinationData.dThumbnail,
                        dExtImage: destinationData.dExtImage,
                        dDistrict: destinationData.dDistrict,
                        dProvince: destinationData.dProvince,
                        longitude: destinationData.longitude || '',
                        latitude: destinationData.latitude || '',
                        thumbnailFile: null
                    });
                }
            } catch (error) {
                console.error('Error fetching destination:', error);
            }
        };

        fetchDestination();
    }, [id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            thumbnailFile: e.target.files[0],
            dThumbnail: e.target.files[0] ? e.target.files[0].name : prevData.dThumbnail
        }));
    };

    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            dProvince: selectedProvince,
            dDistrict: "" 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = AddDestinationValidation(
            formData.destinationID,
            formData.dTitle,
            formData.dDescription,
            formData.dThumbnail,
            formData.dExtImage,
            formData.dDistrict,
            formData.dProvince,
            formData.longitude,
            formData.latitude
        );

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('destinationID', formData.destinationID);
        formDataToSubmit.append('dTitle', formData.dTitle);
        formDataToSubmit.append('dDescription', formData.dDescription);
        
        if (formData.thumbnailFile) {
            formDataToSubmit.append('dThumbnail', formData.thumbnailFile);
        } else {
            formDataToSubmit.append('dThumbnail', formData.dThumbnail); 
        }
        formDataToSubmit.append('dExtImage', formData.dExtImage);
        formDataToSubmit.append('dDistrict', formData.dDistrict);
        formDataToSubmit.append('dProvince', formData.dProvince);
        formDataToSubmit.append('longitude', formData.longitude);
        formDataToSubmit.append('latitude', formData.latitude);

        try {
            await axios.put(url+`/destination/update/${id}`, formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data' 
                }
            });
            setSuccessMessage('Destination updated successfully!');
            setTimeout(() => navigate('/dashboard'), 2000); 
        } catch (error) {
            console.error('Error updating destination:', error);
            setErrors({ update: 'Error updating destination. Please try again later.' });
        }
    };

    if (!destination) return <div>Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <br></br>

            <main className="flex-grow pt-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-lg mx-auto border border-gray-300 p-4 rounded-lg mt-8">
                    <h2 className="text-2xl font-bold mb-4">Edit Destination</h2>

                    {successMessage && (
                        <div className="mb-4 p-4 text-green-800 bg-green-100 rounded-lg">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {errors.update && (
                        <div className="mb-4 p-4 text-red-800 bg-red-100 rounded-lg">
                            <p>{errors.update}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="destinationID" className="block mb-2 text-sm font-medium text-gray-900">Destination ID</label>
                            <input 
                                type="text" 
                                id="destinationID" 
                                value={formData.destinationID}
                                readOnly
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.destinationID ? 'border-red-500' : ''}`}
                            />
                            {errors.destinationID && <p className="text-red-500 text-sm">{errors.destinationID}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dTitle" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                            <input 
                                type="text" 
                                id="dTitle" 
                                value={formData.dTitle}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.dTitle ? 'border-red-500' : ''}`}
                            />
                            {errors.dTitle && <p className="text-red-500 text-sm">{errors.dTitle}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dDescription" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                            <textarea 
                                id="dDescription" 
                                rows="4" 
                                value={formData.dDescription}
                                onChange={handleChange}
                                className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.dDescription ? 'border-red-500' : ''}`}
                            ></textarea>
                            {errors.dDescription && <p className="text-red-500 text-sm">{errors.dDescription}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dThumbnail" className="block mb-2 text-sm font-medium text-gray-900">Thumbnail Image</label>
                            <input 
                                type="file" 
                                id="dThumbnail" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.dThumbnail ? 'border-red-500' : ''}`}
                            />
                            {errors.dThumbnail && <p className="text-red-500 text-sm">{errors.dThumbnail}</p>}
                            {formData.dThumbnail && <p className="mt-2 text-sm">Current thumbnail: {formData.dThumbnail}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dExtImage" className="block mb-2 text-sm font-medium text-gray-900">Things to do</label>
                            <input 
                                type="text" 
                                id="dExtImage" 
                                value={formData.dExtImage}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.dExtImage ? 'border-red-500' : ''}`}
                            />
                            {errors.dExtImage && <p className="text-red-500 text-sm">{errors.dExtImage}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dDistrict" className="block mb-2 text-sm font-medium text-gray-900">District</label>
                            <select
                                id="dDistrict"
                                value={formData.dDistrict}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.dDistrict ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select District</option>
                                {districts[formData.dProvince]?.map((district) => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            {errors.dDistrict && <p className="text-red-500 text-sm">{errors.dDistrict}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dProvince" className="block mb-2 text-sm font-medium text-gray-900">Province</label>
                            <select
                                id="dProvince"
                                value={formData.dProvince}
                                onChange={handleProvinceChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.dProvince ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select Province</option>
                                {provinces.map((province) => (
                                    <option key={province} value={province}>{province}</option>
                                ))}
                            </select>
                            {errors.dProvince && <p className="text-red-500 text-sm">{errors.dProvince}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="longitude" className="block mb-2 text-sm font-medium text-gray-900">Longitude</label>
                            <input 
                                type="text" 
                                id="longitude" 
                                value={formData.longitude}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.longitude ? 'border-red-500' : ''}`}
                            />
                            {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="latitude" className="block mb-2 text-sm font-medium text-gray-900">Latitude</label>
                            <input 
                                type="text" 
                                id="latitude" 
                                value={formData.latitude}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.latitude ? 'border-red-500' : ''}`}
                            />
                            {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude}</p>}
                        </div>

                        <button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Update Destination
                        </button>
                    </form>
                </div>
            </main>

            <br></br><br></br>

            <Footer />
        </div>
    );
}
