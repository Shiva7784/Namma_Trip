import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Spinner from "../../components/spinner/spinner";

export default function EquipmentUserView() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const url=import.meta.env.BACKEND_URL;

  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500); 

        return () => clearTimeout(timer);
    }, []);

  useEffect(() => {
    axios
      .get(url+"/equipment/")
      .then((res) => {
        setEquipmentList(res.data);
        setFilteredEquipment(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = equipmentList.filter(
      (equipment) =>
        (equipment.equipmentName.toLowerCase().includes(lowerCaseQuery) ||
          equipment.equipmentType.toLowerCase().includes(lowerCaseQuery)) &&
        (equipmentType === "" || equipment.equipmentType === equipmentType)
    );

    setFilteredEquipment(filtered);
  }, [searchQuery, equipmentType, equipmentList]);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="container mx-auto pl-10 pr-10 pb-8">
            <div className="pb-10">
              <Navbar />
            </div>

            <div className="search-bar pt-10 mt-10 flex justify-center">
              <input
                type="text"
                placeholder="Search for Equipment"
                className="w-1/2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base"
                style={{ height: "3.5rem" }}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="pt-10 flex justify-center">
              <select
                className="w-1/4 p-2 rounded-lg border border-gray-300"
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
              >
                <option value="">All Equipment Types</option>
                <option value="Hiking">Hiking</option>
                <option value="Luggage">Luggage</option>
                <option value="Clothes">Clothes</option>
                <option value="Toiletries">Toiletries</option>
              </select>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((equipment) => (
                  <Link to={`/equipment/${equipment._id}`} key={equipment._id}>
                    <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center">
                      <img
                        src={url+`/EquipmentImages/${equipment.equipmentImage}`}
                        alt={equipment.equipmentName}
                        className="w-full h-36 object-contain rounded-lg mb-4"
                      />
                      <h2 className="text-lg font-semibold mb-2">
                        {equipment.equipmentName}
                      </h2>
                      <p className="text-blue-600 font-bold text-lg">
                        INR {equipment.equipmentPrice.toFixed(2)}
                      </p>
                      <p className="text-gray-700 mb-2">
                        Type: {equipment.equipmentType}
                      </p>
                      <p className="text-gray-700 mb-2">
                        Quantity: {equipment.equipmentQuantity}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <h1 className="text-center col-span-full">
                  No equipment available
                </h1>
              )}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}
