// ProfileDetails.jsx
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Gift from "../../../assets/Dinitha/gift.json";
import Wallet from "../../../assets/Dinitha/Wallet.json";
import axios from "axios";
import toast from "react-hot-toast";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import { useState, useEffect } from "react";
import TripPlanner from "../../../components/TripPlanner";


const ProfileDetails = ({ userData }) => {
  const [referralCode, setReferralCode] = useState("");
  const [showGiftAnimation, setShowGiftAnimation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [walletBal, setWalletBal] = useState(0);
  const url=import.meta.env.BACKEND_URL;
  const url1=import.meta.env.FRONTEND_URL;

useEffect(() => {
  const fetchWallet = async () => {
    try {
      const res = await axios.get(url+'/api/user/wallet', {
        withCredentials: true,
      });
      setWalletBal(res.data.walletBalance); // ✅ live value
    } catch (err) {
      toast.error("Couldn't fetch wallet balance");
    }
  };

  fetchWallet();
}, []);


  const handleReferralSubmit = async (event) => {
    event.preventDefault();

    if (!referralCode.trim()) {
      setErrorMessage("Please enter a referral code.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await axios.post(
        url+"/api/user/submit-referral-code",
        { referralCode },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setShowGiftAnimation(true);
      setReferralCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleWalletTopup = () => {
    navigate("/payment", {
      state: {
        amount: 500,
        purpose: "wallet",
      },
    });
  };
  console.log("User Data:", userData);
  console.log('vite_Api',import.meta.env.BACKEND_URL)
  console.log('vite_A1pi',url1);


  return (
    <div className="relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

        <div className="flex justify-between items-center mt-6 gap-4 flex-wrap">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-lg shadow-md flex flex-col items-center flex-1 min-w-[250px]">
            <Lottie animationData={Wallet} loop={false} style={{ width: "100px", height: "100px" }} />
            <p className="text-lg font-semibold">Earned money</p>
            <p className="text-2xl font-bold">Wallet Balance: ₹{walletBal ?? 0}</p>
            <button
              onClick={handleWalletTopup}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Add ₹500 to Wallet
            </button>
          </div>

          <div className="bg-green-100 text-green-600 p-4 rounded-lg shadow-md flex flex-col items-center flex-1 min-w-[250px]">
            <Lottie animationData={Gift} loop={false} style={{ width: "100px", height: "100px" }} />
            <p className="text-lg font-semibold">Referred Users</p>
            <p className="text-2xl font-bold">{userData?.referredUsers || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-xl font-semibold mb-4">Profile Details</h3>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={defaultAvatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <p className="text-lg font-semibold">
              {userData?.firstName || "User"} {userData?.lastName || ""}
            </p>
            <p className="text-sm text-gray-500">{userData?.email || "No email"}</p>
          </div>
        </div>

        <p className="mb-4">
          <strong>Referral Code:</strong> {userData?.referralCode || "Not generated yet"}
        </p>
        <p className="mb-4">
          <strong>Invited By:</strong> {userData?.referringUserName || "N/A"}
        </p>

        {userData?.referringUserName === "N/A" && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Did someone refer you?</h4>
            <form onSubmit={handleReferralSubmit} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="text"
                placeholder="Enter referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full sm:w-auto"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </form>
            {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
          </div>
        )}

        <TripPlanner />
      </div>

      {showGiftAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Lottie animationData={Gift} loop={true} style={{ width: "150px", height: "150px" }} />
            <p className="mt-4 text-green-600 text-xl font-semibold text-center">
              🎉 Congratulations! You have received your rewards! 🎉
            </p>
            <button
              onClick={() => {
                setShowGiftAnimation(false);
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
