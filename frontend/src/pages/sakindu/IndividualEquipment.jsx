import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

export default function IndividualEquipment() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState({});
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    if (!id) return;
    axios
      .get(url+`/equipment/get/${id}`)
      .then((res) => setEquipment(res.data.equipment))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <img
                src={url+`/equipmentImages/${equipment.equipmentImage}`}
                alt={equipment.equipmentName}
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {equipment.equipmentName}
              </h1>
              <p className="text-2xl font-semibold text-gray-700 mb-4">
                INR{" "}
                {equipment.equipmentPrice &&
                  equipment.equipmentPrice.toFixed(2)}
              </p>
              <div className="mb-6">
                <p className="text-green-600 font-semibold mb-2">
                  In Stock: {equipment.equipmentQuantity} available
                </p>
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Product Details
                </h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Type:</span>{" "}
                  {equipment.equipmentType}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 break-words whitespace-normal">
                  {equipment.equipmentDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
