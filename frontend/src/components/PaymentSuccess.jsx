import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import Lottie from "lottie-react";
import { QRCodeSVG } from 'qrcode.react';
import successAnimation from "../../src/assets/Dinitha/success-animation.json";
import loadingAnimation from "../../src/assets/Dinitha/loading-animation.json";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");
  const [paymentData, setPaymentData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const hasRunRef = useRef(false);
  const navigate = useNavigate();
  const url1=import.meta.env.BACKEND_URL;

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!orderId || hasRunRef.current) return;

      try {
        hasRunRef.current = true;
        const res = await axios.get(
          url1+`/api/payment/fetch-order/${orderId}`
        );
        const data = res.data;
        setPaymentData(data);
        
        // Set QR code to point to backend receipt endpoint
        setQrCodeValue(url1+`/api/payment/receipt/${orderId}`);

        toast.success("Payment successful!");

        // Update transaction status in your database
        await axios.post(url1+"/api/transaction/add-transaction", {
          userId: data.customer_details.customer_id,
          amount: data.order_amount,
          type : 'Credit',
          status: "Success",
        });
      } catch (err) {
        toast.error("Failed to fetch order details");
        console.error(err);
        navigate("/");
      }
    };

    fetchPaymentDetails();
  }, [orderId, navigate]);

  const downloadPDF = async () => {
    if (!paymentData) {
      toast.error("Payment data not available");
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      // Download PDF directly from backend
      const response = await axios.get(
        url1+`/api/payment/receipt/${paymentData.order_id}`,
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${paymentData.order_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success("Receipt downloaded!");
    } catch (error) {
      toast.error("Failed to download receipt");
      console.error("Download error:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center w-64">
          <Lottie 
            animationData={loadingAnimation} 
            loop={true} 
            className="w-full"
          />
          <p className="mt-4 text-gray-600">Loading your receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-lg">
        {/* Header with Lottie animation */}
        <div className="text-center mb-6">
          <div className="w-40 h-40 mx-auto -mt-10">
            <Lottie 
              animationData={successAnimation} 
              loop={false} 
              className="w-full h-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">Thank you for your purchase. Here's your receipt.</p>
        </div>

        {/* Receipt card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 w-full"></div>
          
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Order Receipt</h2>
                <p className="text-sm text-gray-500">#{paymentData.order_id}</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-500">Date</div>
                <div className="text-sm">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">Amount Paid</span>
                <span className="font-bold text-blue-600">
                  ₹{parseFloat(paymentData.order_amount).toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Customer Email</p>
                  <p className="text-sm break-all">{paymentData.customer_details.customer_email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Phone Number</p>
                  <p className="text-sm">{paymentData.customer_details.customer_phone}</p>
                </div>
              </div>

              {(paymentData.customer_details.customer_address || 
                paymentData.customer_details.customer_city || 
                paymentData.customer_details.customer_country) && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Delivery Address</p>
                  <p className="text-sm">
                    {paymentData.customer_details.customer_address || ''}
                    {paymentData.customer_details.customer_city && 
                      `${paymentData.customer_details.customer_address ? ', ' : ''}${paymentData.customer_details.customer_city}`}
                    {paymentData.customer_details.customer_country && 
                      `${(paymentData.customer_details.customer_address || paymentData.customer_details.customer_city) ? ', ' : ''}${paymentData.customer_details.customer_country}`}
                  </p>
                </div>
              )}
            </div>

            {/* QR Code Section */}
            <div className="mb-6 flex flex-col items-center">
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <QRCodeSVG
                  value={qrCodeValue}
                  size={128}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Scan this QR code to download your receipt
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className={`flex items-center justify-center gap-2 px-6 py-3 ${
                  isGeneratingPDF ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-lg transition-all flex-1`}
              >
                {isGeneratingPDF ? (
                  <div className="w-5 h-5">
                    <Lottie 
                      animationData={loadingAnimation} 
                      loop={true} 
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <FiDownload />
                )}
                <span>{isGeneratingPDF ? 'Generating...' : 'Download Receipt'}</span>
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-all flex-1"
              >
                <FiArrowLeft />
                <span>Back to Profile</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              Thank you for shopping with us. For any questions, contact support@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;