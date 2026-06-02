import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";

function AllEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get(url+"/equipment/");
      setEquipment(res.data);
      setFilteredEquipment(res.data);

      
      const types = [...new Set(res.data.map(equip => equip.equipmentType))];
      setEquipmentTypes(types);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteEquipment = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this Equipment?");
    if (confirmed) {
      try {
        await axios.delete(url+`/equipment/delete/${id}`);
        toast.success('Equipment Deleted Successfully!');
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting Equipment:', error);
        toast.error('Error Deleting Equipment');
      }
    }
  };

  const downloadReport = () => {
    window.open(url+'/equipment/report', '_blank');
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);

    if (type === 'All') {
      setFilteredEquipment(equipment);
    } else {
      const filtered = equipment.filter(equip => equip.equipmentType === type);
      setFilteredEquipment(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-800 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">Equipment Inventory</h1>
              <button
                onClick={downloadReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Download Low Stock Report
              </button>
            </div>
          </div>
  
          <div className="px-6 py-4 border-b border-gray-200 sm:px-8">
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full sm:w-auto px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="All">All Equipment</option>
              {equipmentTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
  
          {/* Grid layout for equipment cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 sm:p-6">
            {filteredEquipment.map((equip) => (
              <div
                key={equip._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 relative"
              >
                {/* Reduced image size */}
                <div className="w-full h-32 flex justify-center items-center p-2">
                  <img
                    src={url+`/EquipmentImages/${equip.equipmentImage}`}
                    alt={equip.equipmentName}
                    className="object-contain max-h-28"
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">{equip.equipmentName}</h2>
                  <p className="text-sm text-gray-600">Type: {equip.equipmentType}</p>
                  <p className="text-sm text-gray-600">Price: Rs. {equip.equipmentPrice}</p>
                  <p className="text-sm text-gray-600">Qty: {equip.equipmentQuantity}</p>
                </div>
  
                {/* Spacing between price and buttons */}
                <div className="p-4"></div>
  
                <div className="absolute bottom-0 left-0 right-0 bg-gray-50 flex justify-between p-2">
                  <button
                    onClick={() => deleteEquipment(equip._id)}
                    className="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/Equipment-dashboard/updateequipment/${equip._id}`}
                    state={{ equipmentToEdit: equip }}
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                  >
                    Update
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  


}

export default AllEquipment;
