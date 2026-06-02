/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../components/Navbar/Navbar";
import Banner from "../Dinitha/Banner";
import ProfileDetails from './Profile/ProfileDetails';
import WalletTransactions from './Profile/WalletTransactions';
import ReferralDetails from './Profile/ReferralDetails';
import Bookings from './Profile/Booking';
import Spinner from '../../components/spinner/spinner'; 
import generatePDF from './Profile/pdfGen';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    referralCode: '',
    walletBalance: 0,
    referredUsers: 0,
    referringUserName: 'N/A',
  });
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [referralLogs, setReferralLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url=import.meta.env.BACKEND_URL;
  const url1=import.meta.env.FRONTEND_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(url+'/api/user/profile', { withCredentials: true });
        const { firstName, lastName, email, referralCode, referringUserName } = response.data;

        const validReferringUserName = referringUserName === "undefined undefined" ? 'N/A' : referringUserName;

        setUserData(prevState => ({
          ...prevState,
          firstName,
          lastName,
          email,
          referralCode,
          referringUserName: validReferringUserName,
        }));
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    const fetchWalletTransactions = async () => {
      try {
          const response = await axios.get(url+'/api/user/wallet', { withCredentials: true });
          const { transactionHistory, successfulTransactionsTotal } = response.data; 
          setWalletTransactions(transactionHistory || []);
          setUserData(prevState => ({
              ...prevState,
              walletBalance: successfulTransactionsTotal || 0,
          }));
      } catch (error) {
          setWalletTransactions([]);
          setUserData(prevState => ({
              ...prevState,
              walletBalance: 0, 
          }));
      }
  };

    const fetchReferralLogs = async () => {
      try {
        const response = await axios.get(url+'/api/user/referrals', { withCredentials: true });
        const referrals = response.data;

        setReferralLogs(referrals || []);
        const referredUsersCount = referrals.length || 0;

        setUserData(prevState => ({
          ...prevState,
          referredUsers: referredUsersCount,
        }));
      } catch (error) {
        setReferralLogs([]);
        setUserData(prevState => ({
          ...prevState,
          referredUsers: 0,
        }));
      }
    };

    const fetchData = async () => {
      setLoading(true); 
      await Promise.all([fetchUserData(), fetchWalletTransactions(), fetchReferralLogs()]);
      setLoading(false); 
    };

    fetchData();
  }, []);

  const shareReferralCode = () => {
    const referralUrl = `${window.location.origin}/signup?refid=${userData.referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    toast.success('Referral link copied to clipboard!');
  };

  const handleDownloadWallet = (filteredTransactions, startDate, endDate, selectedType) => {
    generatePDF(filteredTransactions, 'wallet-transactions.pdf', 'wallet', `${userData.firstName} ${userData.lastName}`, startDate, endDate, selectedType);
  };

  const handleDownloadReferral = () => {
    generatePDF(referralLogs, 'referral-logs.pdf', 'referral', `${userData.firstName} ${userData.lastName}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-lg">
          <div className="p-6 mt-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Profile</h2>
            <nav>
              <ul>
                {['account', 'wallet', 'referral', 'bookings'].map(tab => (
                  <li key={tab} className="mb-6">
                    <button
                      className={`text-lg w-full text-left ${activeTab === tab ? 'text-blue-600 font-semibold' : 'text-gray-800'}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 mt-24">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner /> 
            </div>
          ) : (
            <>
              {error && <div className="text-red-600 mb-4">{error}</div>}
              {activeTab === 'account' && <ProfileDetails userData={userData} />}
              {activeTab === 'wallet' && <WalletTransactions walletTransactions={walletTransactions} handleDownloadWallet={handleDownloadWallet} />}
              {activeTab === 'referral' && <ReferralDetails referralLogs={referralLogs} userData={userData} shareReferralCode={shareReferralCode} handleDownloadReferral={handleDownloadReferral} />}
              {activeTab === 'bookings' && <Bookings />}
            </>
          )}
        </main>
      </div>
      <Banner />
    </div>
  );
};

export default ProfilePage;
