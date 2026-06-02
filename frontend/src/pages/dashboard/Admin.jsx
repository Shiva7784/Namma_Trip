import { useState, useContext } from "react";
import { UserContext } from "../../components/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import Users from "./Dinitha/Users"; 
import AddEquipment from "../sakindu/AddEquipment";
import Inventory from "../sakindu/Inventory";
import Spinner from "../../components/spinner/spinner";
import Transactions from "./Dinitha/Transactions"; 
import Referrals from "./Dinitha/Referrals"; 
import Overview from "./Dinitha/Overview";
import AddTourPackage from '../IshanFrontend/AddTourPackage';
import AllTourPackages from '../IshanFrontend/AllPackagesAdmin';
import AddBlog from "../Ishanka/AddBlog";
import BlogList from "../Ishanka/BlogList";
import AllDestinations from "../destination/allDestination";
import AddDestination from "../destination/addDestination";
import BookingList from "../Jihan/BookingList";
import SupportAgentTickets from "../ticket/SupportAgentTickets";


const Admin = () => {
  const { setUser, loading, error } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('overview');
  const url=import.meta.env.BACKEND_URL;



  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      await axios.post(url+'/api/auth/signout', {}, { withCredentials: true });
      
      setUser(null);
      window.location.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold bg-gray-900">Admin Dashboard</div>
        <nav className="flex-1 px-2 py-4">
          {['overview', 'users', 'transactions', 'referrals', 'Manage Inventory', 'Add Equipment', 'Manage TourPackages', 'Add TourPackage', 'Manage Blogs', 'Add Blogs', 'Manage Destinations', 'Add Destinations', 'Booking List', 'Manage Tickets'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`block w-full text-left px-4 py-2 rounded ${activeTab === tab ? 'bg-gray-700' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 w-full rounded hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </aside>

      
      <main className="flex-1 p-6">
        
        <header className="bg-white shadow p-4 rounded mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Welcome, Admin!</h2>
        </header>

      
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner /> 
          </div>
        ) : (
          <>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {activeTab === 'overview' && <Overview />}
            {activeTab === 'users' && <Users />} 
            {activeTab === 'transactions' && <Transactions />} 
            {activeTab === 'referrals' && <Referrals />} 
            {activeTab === 'Manage Inventory' && <Inventory />}
            {activeTab === 'Add Equipment' && <AddEquipment />}
            {activeTab === 'Manage TourPackages' && <AllTourPackages />}
            {activeTab === 'Add TourPackage' && <AddTourPackage />}
            {activeTab === 'Manage Blogs' && <BlogList />}
            {activeTab === 'Add Blogs' && <AddBlog />}
            {activeTab === 'Manage Destinations' && <AllDestinations />}
            {activeTab === 'Add Destinations' && <AddDestination />}
            {activeTab === 'Booking List' && <BookingList />}
            {activeTab === 'Manage Tickets' && <SupportAgentTickets />}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;