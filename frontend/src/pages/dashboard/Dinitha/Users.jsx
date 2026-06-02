
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Confirmation from "../Confirm";
import Spinner from '../../../components/spinner/spinner'; 

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({ firstName: '', lastName: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const itemsPerPage = 5;
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const userDate = new Date(user.createdAt).toLocaleDateString();
      const isWithinDateRange = (!startDate || userDate >= new Date(startDate).toLocaleDateString()) &&
                                  (!endDate || userDate <= new Date(endDate).toLocaleDateString());

      return (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
             isWithinDateRange;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, startDate, endDate, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url+'/api/user/'); // API for fetching users
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (userId) => {
    const user = users.find(u => u._id === userId);
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      await axios.put(url+`/api/user/${userId}/suspend`); // API for toggling user status
      
      setUsers(prev => 
        prev.map(u => 
          u._id === userId ? { ...u, status: newStatus } : u
        )
      );

      toast.success(`User ${newStatus === "suspended" ? "suspended" : "activated"} successfully.`);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status.");
      fetchUsers(); // Fallback to re-fetching users in case of an error
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.put(url+`/api/user/${userId}/role`, { role: newRole }); // API for updating user role

      
      setUsers(prev => 
        prev.map(u => 
          u._id === userId ? { ...u, role: newRole } : u
        )
      );

      toast.success(`User role updated to ${newRole}.`);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role.");
      fetchUsers(); // Fallback to re-fetching users in case of an error
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setUpdatedUserData({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(url+`/api/user/${editingUser._id}/update`, updatedUserData); // API for updating user
      
      // Optimistically update local state
      setUsers(prev => 
        prev.map(u => 
          u._id === editingUser._id ? { ...u, ...updatedUserData } : u
        )
      );

      toast.success("User updated successfully.");
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user.");
      fetchUsers(); // Fallback to re-fetching users in case of an error
    }
  };

  const handleDeleteUser = (userId) => {
    setUserIdToDelete(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userIdToDelete) {
      try {
        await axios.delete(url+`/api/user/${userIdToDelete}/delete`); // API for deleting user
        
        // Optimistically update local state
        setUsers(prev => prev.filter(user => user._id !== userIdToDelete));

        toast.success('User deleted successfully.');
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      } finally {
        setIsModalOpen(false);
        setUserIdToDelete(null);
      }
    }
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) return <Spinner />; // Show spinner while loading

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>

      <p className="block mb-2">Search by Email or Name</p>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter user's name or email to search"
        className="border p-2 rounded mb-4 w-full"
      />

      <p className="block mb-2">Filter by Registered Dates</p>
      <div className="flex space-x-4 mb-4">
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="p-2 border border-gray-300 rounded-md w-full cursor-pointer"
        />
        <p className="block mb-2">to</p>
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className="p-2 border border-gray-300 rounded-md w-full cursor-pointer"
        />
      </div>

      {editingUser && (
        <form onSubmit={handleUpdateUser} className="mb-4 p-4 border rounded">
          <h3 className="text-lg mb-2 font-semibold">Edit User</h3>
          <input
            type="text"
            value={updatedUserData.firstName}
            onChange={(e) => setUpdatedUserData({ ...updatedUserData, firstName: e.target.value })}
            placeholder="First Name"
            className="border p-2 rounded mb-2 w-full"
            required
          />
          <input
            type="text"
            value={updatedUserData.lastName}
            onChange={(e) => setUpdatedUserData({ ...updatedUserData, lastName: e.target.value })}
            placeholder="Last Name"
            className="border p-2 rounded mb-2 w-full"
            required
          />
          <input
            type="email"
            value={updatedUserData.email}
            onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
            placeholder="Email"
            className="border p-2 rounded mb-2 w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update User</button>
          <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600">Cancel</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Registered Date</th>
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{user.firstName}</td>
                <td className="border px-4 py-2">{user.lastName}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  <button 
                    onClick={() => handleToggle(user._id)} 
                    className={`px-2 py-1 rounded ${user.status === 'suspended' ? 'bg-red-500 text-white w-24 rounded-full hover:bg-red-600' : 'bg-green-500 text-white w-24 rounded-full hover:bg-green-600'}`}
                  >
                    {user.status === 'suspended' ? 'Suspended' : 'Active'}
                  </button>
                </td>
                <td className="border px-4 py-2 cur">
                  <select onChange={(e) => handleUpdateRole(user._id, e.target.value)} defaultValue={user.role}>
                    <option value="traveler">Traveler</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleEditClick(user)} className="bg-blue-500 text-white px-2 py-1 rounded w-24 hover:bg-blue-600">Update</button>
                  <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2 w-24 hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
      <div className="mt-4">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400" disabled={currentPage === 1}>Previous</button>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredUsers.length / itemsPerPage)))} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)}>Next</button>
      </div>

      <Confirmation 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
};

export default Users;
