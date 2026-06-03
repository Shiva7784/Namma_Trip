import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../../components/spinner/spinner';
import { toast } from 'react-hot-toast';
import Lottie from "lottie-react";
import Gift from "../../../assets/Dinitha/gift.json";
import Wallet from "../../../assets/Dinitha/Wallet.json";
import User from "../../../assets/Dinitha/user.json";

const Overview = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        transactionAmount: 0,
        totalReferrals: 0,
        totalTransactionVolume: 0,  // New state for transaction volume
    });
    const [loading, setLoading] = useState(true);
    const url=import.meta.env.BACKEND_URL;

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const fetchOverviewData = async () => {
        setLoading(true);
        try {
            const userCountResponse = await axios.get(url+'/api/user/');
            const transactionResponse = await axios.get(url+'/api/transaction/');
            const totalReferralsResponse = await axios.get(url+'/api/referral/');

            const userCount = userCountResponse.data.length;

            // Calculate total transaction amount and volume
            let totalTransactionAmount = 0;
            let totalTransactionVolume = 0;

            transactionResponse.data.forEach(user => {
                user.transactionHistory.forEach(transaction => {
                    totalTransactionAmount += transaction.amount;
                    totalTransactionVolume += transaction.amount; // Add to total transaction volume
                });
            });

            const totalReferrals = totalReferralsResponse.data.length;

            setStats({
                userCount,
                transactionAmount: totalTransactionAmount,
                totalReferrals,
                totalTransactionVolume,  // Set total transaction volume
            });
        } catch (error) {
            console.error("Error fetching overview data:", error);
            toast.error("Failed to fetch overview data.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-100 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <Lottie animationData={User} loop={true} style={{ width: "80px", height: "80px", marginBottom: "10px" }} />
                    <h3 className="text-lg font-semibold">Registered Users</h3>
                    <p className="text-3xl font-bold">{stats.userCount}</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <Lottie animationData={Wallet} loop={true} style={{ width: "80px", height: "80px", marginBottom: "10px" }} />
                    <h3 className="text-lg font-semibold">Total Transaction Amount</h3>
                    <p className="text-3xl font-bold">INR {stats.transactionAmount.toFixed(2)}</p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <Lottie animationData={Gift} loop={true} style={{ width: "80px", height: "80px", marginBottom: "10px" }} />
                    <h3 className="text-lg font-semibold">Total Referrals</h3>
                    <p className="text-3xl font-bold">{stats.totalReferrals}</p>
                </div>
                <div className="bg-red-100 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <Lottie animationData={Wallet} loop={true} style={{ width: "80px", height: "80px", marginBottom: "10px" }} />
                    <h3 className="text-lg font-semibold">Total Transaction Volume</h3>
                    <p className="text-3xl font-bold">INR {stats.totalTransactionVolume.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default Overview;
