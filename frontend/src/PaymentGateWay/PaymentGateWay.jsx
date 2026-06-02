import { forwardRef, useImperativeHandle, useContext, useRef, useEffect } from "react";
import { UserContext } from "../components/userContext";
import { load } from "@cashfreepayments/cashfree-js";
import toast from "react-hot-toast";

const PaymentGateway = forwardRef(({ amount, setLoading }, ref) => {
  const { user } = useContext(UserContext);
  const cashfreeRef = useRef(null);
  

  useEffect(() => {
    const init = async () => {
      try {
        const cf = await load({ mode: "sandbox" }); // Change to 'production' when live
        cashfreeRef.current = cf;
        console.log("✅ Cashfree SDK loaded");
      } catch (err) {
        console.error("❌ SDK load failed:", err);
        toast.error("Failed to load payment gateway.");
      }
    };
    init();
  }, []);

  const initiatePayment = async (paymentSessionId) => {
    console.log("👉 Received sessionId in gateway:", paymentSessionId);

    if (!paymentSessionId) {
      toast.error("Payment session missing");
      return;
    }

    if (!cashfreeRef.current) {
      toast.error("SDK not ready");
      return;
    }

    try {
      setLoading(true);

      const result = await cashfreeRef.current.checkout({
        paymentSessionId,
        redirect: true, // ✅ Redirect mode
      });

      // ❌ Do not handle anything after result in redirect mode
      // Everything continues in return_url (frontend)
    } catch (err) {
      console.error("❌ Payment error:", err);
      toast.error("Payment failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    initiatePayment,
  }));

  return null;
});

export default PaymentGateway;
