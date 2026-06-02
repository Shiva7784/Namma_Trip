import React, { useState } from 'react';
import axios from 'axios';
import ValidateAddEquipment from './validateAddEquipment';

const districtNames = [
  "Bengaluru Urban", "Bengaluru Rural", "Ramanagara", "Tumakuru", "Chikkaballapur", "Kolar",
  "Chitradurga", "Davangere", "Shivamogga", "Chikkamagaluru", "Hassan",
  "Mysuru", "Mandya", "Chamarajanagar", "Kodagu",
  "Ballari", "Bidar", "Kalaburagi", "Raichur", "Yadgir", "Koppal", "Vijayapura", "Bagalkot",
  "Belagavi", "Dharwad", "Gadag", "Haveri",
  "Uttara Kannada", "Dakshina Kannada", "Udupi"
];

function AddEquipment() {
  const [equipmentId, setEquipmentId] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [equipmentDescription, setEquipmentDescription] = useState("");
  const [equipmentImage, setEquipmentImage] = useState(null);
  const [equipmentPrice, setEquipmentPrice] = useState("");
  const [equipmentQuantity, setEquipmentQuantity] = useState(50);
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const url=import.meta.env.BACKEND_URL;

  const handleTagChange = (district) => {
    setTags(prevTags => 
      prevTags.includes(district) 
        ? prevTags.filter(tag => tag !== district)
        : [...prevTags, district]
    );
  };

  function addEquipment(e) {
    e.preventDefault();
  
    const equipment = {
      equipmentId,
      equipmentName,
      equipmentType,
      equipmentDescription,
      equipmentImage,
      equipmentPrice,
      equipmentQuantity,
      tags
    };
  
    const validationErrors = ValidateAddEquipment(equipment);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const formData = new FormData();
    formData.append("equipmentId", equipmentId);
    formData.append("equipmentName", equipmentName);
    formData.append("equipmentType", equipmentType);
    formData.append("equipmentDescription", equipmentDescription);
    formData.append("equipmentImage", equipmentImage);
    formData.append("equipmentPrice", equipmentPrice);
    formData.append("equipmentQuantity", equipmentQuantity);
    formData.append("districtTags", JSON.stringify(tags));  // Change here
  
    axios.post(url+"/equipment/add", formData)
      .then(() => {
        setSuccessMessage('✅ Equipment added successfully!');
        setEquipmentId('');
        setEquipmentName('');
        setEquipmentType('');
        setEquipmentDescription('');
        setEquipmentPrice('');
        setEquipmentQuantity(50);
        setEquipmentImage(null);
        setTags([]);
  
        setTimeout(() => {
          setSuccessMessage('');
        }, 2000);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Add Equipment</h2>
          </div>

          <form onSubmit={addEquipment} className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label htmlFor="equipmentId" className="block text-sm font-medium text-gray-700">
                  Equipment ID
                </label>
                <input
                  id="equipmentId"
                  type="text"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => setEquipmentId(e.target.value)}
                  value={equipmentId}
                />
                {errors.equipmentId && <p className="mt-2 text-sm text-red-600">{errors.equipmentId}</p>}
              </div>

              <div>
                <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700">
                  Equipment Name
                </label>
                <input
                  id="equipmentName"
                  type="text"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => setEquipmentName(e.target.value)}
                  value={equipmentName}
                />
                {errors.equipmentName && <p className="mt-2 text-sm text-red-600">{errors.equipmentName}</p>}
              </div>
  
              <div>
                <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-700">
                  Equipment Type
                </label>
                <select
                  id="equipmentType"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => setEquipmentType(e.target.value)}
                  value={equipmentType}
                >
                  <option value="">Select Type</option>
                  <option>Hiking</option>
                  <option>Luggage</option>
                  <option>Clothes</option>
                  <option>Toiletries</option>
                </select>
                {errors.equipmentType && <p className="mt-2 text-sm text-red-600">{errors.equipmentType}</p>}
              </div>

              <div>
                <label htmlFor="equipmentPrice" className="block text-sm font-medium text-gray-700">
                  Equipment Price
                </label>
                <input
                  id="equipmentPrice"
                  type="text"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => setEquipmentPrice(e.target.value)}
                  value={equipmentPrice}
                />
                {errors.equipmentPrice && <p className="mt-2 text-sm text-red-600">{errors.equipmentPrice}</p>}
              </div>

              <div>
                <label htmlFor="equipmentQuantity" className="block text-sm font-medium text-gray-700">
                  Equipment Quantity
                </label>
                <input
                  id="equipmentQuantity"
                  type="number"
                  min="0"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => setEquipmentQuantity(parseInt(e.target.value))}
                  value={equipmentQuantity}
                />
                {errors.equipmentQuantity && <p className="mt-2 text-sm text-red-600">{errors.equipmentQuantity}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="equipmentDescription" className="block text-sm font-medium text-gray-700">
                  Equipment Description
                </label>
                <textarea
                  id="equipmentDescription"
                  rows="4"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => setEquipmentDescription(e.target.value)}
                  value={equipmentDescription}
                />
                {errors.equipmentDescription && <p className="mt-2 text-sm text-red-600">{errors.equipmentDescription}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="equipmentImage" className="block text-sm font-medium text-gray-700">
                  Equipment Image
                </label>
                <input
                  id="equipmentImage"
                  type="file"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => setEquipmentImage(e.target.files[0])}
                />
                {errors.equipmentImage && <p className="mt-2 text-sm text-red-600">{errors.equipmentImage}</p>}
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
                          tags.includes(district)
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
                  Selected: {tags.length} / {districtNames.length}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Equipment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEquipment;