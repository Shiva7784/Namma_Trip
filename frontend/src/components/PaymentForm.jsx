import { useState, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../components/userContext";
import PaymentGateway from "../PaymentGateWay/PaymentGateWay";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Lottie from "lottie-react";
import Payment from "../assets/Dinitha/secure-payment.json";
import toast from "react-hot-toast";

const PaymentForm = () => {
  const { user } = useContext(UserContext);
  const paymentGatewayRef = useRef();
  const url=import.meta.env.BACKEND_URL;

  const [formData, setFormData] = useState({
    phone: "",
    amount: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: ""
  });

  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Please log in to access the payment page.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName) errs.firstName = "First name is required.";
    if (!formData.lastName) errs.lastName = "Last name is required.";
    if (!formData.email || !formData.email.includes("@")) errs.email = "Valid email is required.";
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      errs.phone = "Phone must start with 6, 7, 8, or 9 and be 10 digits.";
    }
    if (!formData.address) errs.address = "Address is required.";
    if (!formData.city) errs.city = "City is required.";
    if (!(formData.amount >= 100 && formData.amount <= 100000)) {
      errs.amount = "Amount must be between ₹100 and ₹10,000.";
    }
    if (!agree) errs.terms = "You must agree to the terms.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await axios.post(url+"/api/payment/create-order", {
        amount: formData.amount,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerId: user.userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city
      });

      const sessionId = res.data.payment_session_id;
      await paymentGatewayRef.current?.initiatePayment(sessionId);

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-32 pb-20">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex">
          <div className="w-1/2 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-center pb-4">Payment Details</h3>

              {errors.server && <p className="text-red-600">{errors.server}</p>}

              <div className="flex space-x-2">
                <div className="w-full">
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md w-full"
                  />
                  {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                </div>
                <div className="w-full">
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md w-full"
                  />
                  {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                </div>
              </div>

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md w-full"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

              <input
                name="phone"
                type="tel"
                placeholder="07XXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md w-full"
              />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}

              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md w-full"
              />
              {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}

              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md w-full"
              />
              {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}

              <input
                name="amount"
                type="number"
                placeholder="Amount (₹100 - ₹10,000)"
                value={formData.amount}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md w-full"
              />
              {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="peer hidden"
                />
                <label htmlFor="terms" className="flex items-center cursor-pointer text-sm">
                  <div className={`w-5 h-5 border-2 border-gray-300 rounded-md flex items-center justify-center mr-2 ${agree ? 'bg-blue-600' : ''}`}>
                    {agree && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 10l3 3 7-7-1.4-1.4L10 11.6 8.4 10 7 10z" />
                      </svg>
                    )}
                  </div>
                  I agree to the Terms and Conditions
                </label>
              </div>
              {errors.terms && <p className="text-red-600 text-sm">{errors.terms}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : "Confirm Payment"}
              </button>
            </form>
          </div>

          <Lottie animationData={Payment} loop={true} className="w-1/2 bg-gray-100" />
        </div>

        <PaymentGateway ref={paymentGatewayRef} amount={formData.amount} setLoading={setLoading} />
      </div>
      <Footer />
    </>
  );
};

export default PaymentForm;
