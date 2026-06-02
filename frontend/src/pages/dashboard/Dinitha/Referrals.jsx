import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Spinner from '../../../components/spinner/spinner';
import ConfirmModal from '../Confirm'; // Ensure this path is correct

const Referrals = () => {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [referralsPerPage] = useState(5);
    const [deleteReferralId, setDeleteReferralId] = useState(null);
    const url=import.meta.env.BACKEND_URL;

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        setLoading(true);
        try {
            const response = await axios.get(url+'/api/referral');
            setReferrals(response.data);
        } catch (error) {
            console.error("Error fetching referrals:", error);
            toast.error("Failed to fetch referrals.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (referralId, currentStatus) => {
        const newStatus = currentStatus === 'Success' ? 'Suspended' : 'Success';
        try {
            await axios.put(url+'/api/referral/toggle-status', { referralId, newStatus });

            // Update local state without re-fetching
            setReferrals(prev => 
                prev.map(referral => 
                    referral._id === referralId ? { ...referral, status: newStatus } : referral
                )
            );

            toast.success(`Referral status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating referral status:", error);
            toast.error("Failed to update referral status.");
        }
    };

    const handleDeleteReferral = async () => {
        if (deleteReferralId) {
            try {
                await axios.delete(url+`/api/referral/${deleteReferralId}`);
                // Update local state without re-fetching
                setReferrals(prev => prev.filter(referral => referral._id !== deleteReferralId));
                toast.success('Referral deleted successfully.');
            } catch (error) {
                console.error("Error deleting referral:", error);
                toast.error("Failed to delete referral.");
            }
            // Reset modal state
            setDeleteReferralId(null);
        }
    };

    const filteredReferrals = referrals.filter(referral => {
        const withinDateRange = (
            (!startDate || new Date(referral.date) >= startDate) &&
            (!endDate || new Date(referral.date) <= endDate)
        );
        const matchesSearchTerm = referral.referringUserName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   referral.referredUserName.toLowerCase().includes(searchTerm.toLowerCase());
        return withinDateRange && matchesSearchTerm;
    });

    const indexOfLastReferral = currentPage * referralsPerPage;
    const indexOfFirstReferral = indexOfLastReferral - referralsPerPage;
    const currentReferrals = filteredReferrals.slice(indexOfFirstReferral, indexOfLastReferral);

    if (loading) return <Spinner />;

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Manage Referrals</h2>

            <p className="block mb-2">Search by Name</p>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter user's name to search"
                className="border p-2 rounded mb-4 w-full"
            />

            <p className="block mb-2">Filter by Referred Dates</p>
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

            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Referred Date</th>
                        <th className="border px-4 py-2">Referred By Name</th>
                        <th className="border px-4 py-2">Referred Name</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentReferrals.length > 0 ? (
                        currentReferrals.map(referral => (
                            <tr key={referral._id}>
                                <td className="border px-4 py-2">{new Date(referral.date).toLocaleDateString()}</td>
                                <td className="border px-4 py-2">{referral.referringUserName}</td>
                                <td className="border px-4 py-2">{referral.referredUserName}</td>
                                <td className="border px-4 py-2">
                                    <button 
                                        onClick={() => handleToggleStatus(referral._id, referral.status)} 
                                        className={`px-2 py-1 rounded ${referral.status === 'Suspended' ? 'bg-red-500 text-white w-24 hover:bg-red-600 rounded-full' : 'bg-green-500 text-white w-24 hover:bg-green-600 rounded-full'}`}
                                    >
                                        {referral.status === 'Suspended' ? 'Suspended' : 'Success'}
                                    </button>
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => setDeleteReferralId(referral._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded ml-2 w-24 hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="border px-4 py-2 text-center">No referrals found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="mt-4">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredReferrals.length / referralsPerPage)))} 
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    disabled={currentPage === Math.ceil(filteredReferrals.length / referralsPerPage)}
                >
                    Next
                </button>
            </div>

            <ConfirmModal
                isOpen={deleteReferralId !== null}
                onClose={() => setDeleteReferralId(null)}
                onConfirm={handleDeleteReferral}
            />
        </div>
    );
};

export default Referrals;
