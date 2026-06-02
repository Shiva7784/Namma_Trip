import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";

const districtNames = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna",
  "Kilinochchi", "Mullaitivu", "Vavuniya", "Batticaloa", "Ampara", "Polonnaruwa", "Anuradhapura", "Kurunegala", 
  "Puttalam", "Trincomalee", "Ratnapura", "Kegalle", "Badulla", "Moneragala", "Sabaragamuwa"
];

export default function UpdateEquipment() {
    const { id } = useParams();
    const [values, setValues] = useState({
        equipmentId: '',
        equipmentName: '',
        equipmentPrice: 0,
        equipmentType: '',
        equipmentQuantity: 0,
        equipmentImage: '',
        districtTags: []
    });
    const url=import.meta.env.BACKEND_URL;

    useEffect(() => {
        axios.get(url+`/equipment/get/${id}`)
            .then((response) => {
                const equipmentData = response.data.equipment;
                setValues({
                    equipmentId: equipmentData.equipmentId, 
                    equipmentName: equipmentData.equipmentName,
                    equipmentPrice: equipmentData.equipmentPrice,
                    equipmentType: equipmentData.equipmentType,
                    equipmentQuantity: equipmentData.equipmentQuantity,
                    equipmentImage: equipmentData.equipmentImage,
                    districtTags: equipmentData.districtTags || []
                });
            })
            .catch((err) => {
                console.error('Error fetching equipment:', err);
            });
    }, [id]);

    const navigate = useNavigate();

    const handleTagChange = (district) => {
        setValues(prevValues => ({
            ...prevValues,
            districtTags: prevValues.districtTags.includes(district)
                ? prevValues.districtTags.filter(tag => tag !== district)
                : [...prevValues.districtTags, district]
        }));
    };

    const updateequipment = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (key === 'equipmentImage' && typeof values[key] === 'object') {
                formData.append(key, values[key]);
            } else if (key === 'districtTags') {
                formData.append(key, JSON.stringify(values.districtTags));
            } else if (key !== 'equipmentImage') {
                formData.append(key, values[key]);
            }
        });
    
        axios.put(url+`/equipment/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            toast.success('Equipment Updated Successfully!');
            navigate(`/dashboard`);
        }).catch((err) => {
            toast.error('Error Updating Equipment');
            console.error('Error:', err);
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster />
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white">Update Equipment</h2>
                    </div>

                    <form onSubmit={updateequipment} className="px-6 py-4 space-y-6">
                        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="equipmentId" className="block text-sm font-medium text-gray-700">
                                    Equipment ID
                                </label>
                                <input
                                    type="text"
                                    id="equipmentId"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                                    value={values.equipmentId}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700">
                                    Equipment Name
                                </label>
                                <input
                                    type="text"
                                    id="equipmentName"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={values.equipmentName}
                                    onChange={(e) => setValues({ ...values, equipmentName: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="equipmentPrice" className="block text-sm font-medium text-gray-700">
                                    Equipment Price
                                </label>
                                <input
                                    type="number"
                                    id="equipmentPrice"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={values.equipmentPrice}
                                    onChange={(e) => setValues({ ...values, equipmentPrice: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-700">
                                    Equipment Type
                                </label>
                                <select
                                    id="equipmentType"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={values.equipmentType}
                                    onChange={(e) => setValues({ ...values, equipmentType: e.target.value })}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option>Hiking</option>
                                    <option>Luggage</option>
                                    <option>Clothes</option>
                                    <option>Toiletries</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="equipmentQuantity" className="block text-sm font-medium text-gray-700">
                                    Equipment Quantity
                                </label>
                                <input
                                    type="number"
                                    id="equipmentQuantity"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={values.equipmentQuantity}
                                    onChange={(e) => setValues({ ...values, equipmentQuantity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="equipmentImage" className="block text-sm font-medium text-gray-700">
                                    Equipment Image
                                </label>
                                <input
                                    type="file"
                                    id="equipmentImage"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={(e) => setValues({ ...values, equipmentImage: e.target.files[0] })}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Tags (Districts)
                                </label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex flex-wrap gap-2">
                                        {districtNames.map((district) => (
                                            <button
                                                key={district}
                                                type="button"
                                                onClick={() => handleTagChange(district)}
                                                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ease-in-out ${
                                                    values.districtTags.includes(district)
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                {district}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Selected: {values.districtTags.length} / {districtNames.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Update Equipment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}