import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import toast from 'react-hot-toast';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../assets/logo';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import autoTable from 'jspdf-autotable';

const Confirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(location.state?.data || null);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [walletBal, setWalletBal] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const handlingFee = 1000;
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      try {
        const res = await axios.get(url+`/api/bookings/${bookingId}`);
        res.data.handlingFee = handlingFee;
        const equipmentTotal = res.data.equipment?.reduce((sum, e) => sum + e.price, 0) || 0;
        const gst = ((res.data.packagePrice + equipmentTotal + handlingFee) * 0.05);
        res.data.totalPrice = res.data.packagePrice + equipmentTotal + handlingFee + gst;
        setBookingData(res.data);
      } catch (err) {
        console.error('Error fetching booking:', err);
      }
    };
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (!bookingData || !bookingData._id) navigate('/package');
  }, [bookingData, navigate]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await axios.get(url+'/api/user/wallet', {
          withCredentials: true,
        });
        setWalletBal(data.walletBalance);
      } catch (err) {
        console.error(err);
        toast.error('Unable to load wallet balance');
      }
    };
    fetchWallet();
  }, []);

  const handleDelete = async () => {
    if (!bookingData._id) return setErrorMessage('Booking data is missing.');
    try {
      await axios.delete(url+`/api/bookings/${bookingData._id}`);
      setOpenDialog(false);
      toast.success('Booking Deleted Successfully');
      if (bookingData.isPaid) setShowRefundAnimation(true);
      else navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMessage('Error deleting the booking. Please try again.');
    }
  };

  const handleEdit = () => {
    if (!bookingData._id) return setErrorMessage('Booking data is missing.');
    navigate(`/book/${bookingData._id}`, { state: { data: bookingData } });
  };

  const handlePayNow = async () => {
    if (!bookingData?._id) return setErrorMessage('Booking data is missing.');
    if (walletBal === null) return toast.error('Wallet balance not loaded yet.');
    if (walletBal < bookingData.totalPrice) return toast.error('Insufficient wallet balance');
  
    try {
      // 1. Add transaction
      await axios.post(url+'/api/transaction/add-transaction', {
        userId: bookingData.userId,
        amount: bookingData.totalPrice,
        type: 'Debit',
        status: 'Success',
      }, { withCredentials: true });
  
      // 2. Mark booking as paid
      await axios.put(url+`/api/bookings/${bookingData._id}/mark-paid`, {
        isPaid: true,
      }, { withCredentials: true });
  
      // 3. Update local wallet balance
      setWalletBal(prev => prev - bookingData.totalPrice);
  
      // 4. PDF Receipt Generation
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
  
      // Add Logo
      const imgW = 70, imgH = 20;
      const xPos = (pageWidth - imgW) / 2;
      doc.addImage(logo, 'PNG', xPos, 10, imgW, imgH);
  
      // Add Title
      doc.setFontSize(20).text('Booking Receipt', 14, 35);
  
      const equipmentDetails = bookingData.equipment?.length
        ? bookingData.equipment.map(e => `${e.name} (₹${e.price})`).join('\n')
        : 'None';
  
      const equipmentTotal = bookingData.equipment?.reduce((sum, e) => sum + e.price, 0) || 0;
      const gst = ((bookingData.packagePrice + equipmentTotal + handlingFee) * 0.05);

      const sanitizeText = (text) => {
        if (!text) return '';
        return text
          .replace(/[^\x00-\x7F]/g, '') // remove non-ASCII characters
          .trim();
      };
  
      const rows = [
        ['Full Name', sanitizeText(bookingData.fullName)],
        ['Email', sanitizeText(bookingData.email)],
        ['Phone', sanitizeText(bookingData.phone)],
        ['Address', sanitizeText(bookingData.address)],
        ['Date', new Date().toLocaleDateString()],
        ['Package', sanitizeText(bookingData.packageName)],
        ['Selected Equipment', sanitizeText(equipmentDetails)],
        ['Package Price', `INR ${bookingData.packagePrice?.toFixed(2) || '0.00'}`],
        ['Handling Fee', `INR ${handlingFee.toFixed(2)}`],
        ['GST (5%)', `INR ${gst.toFixed(2)}`],
        ['Total', `INR ${bookingData.totalPrice.toFixed(2)}`],
      ];
  
      autoTable(doc, {
        startY: 45,
        head: [['Item', 'Details']],
        body: rows,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak', // Wrap long content
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 130 },
        },
      });
  
      doc.save(`${bookingData.fullName}_receipt.pdf`);
  
      // 5. Final Toast
      toast.success('Payment successful — receipt downloaded & booking marked paid.');
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Payment Error:', err);
      toast.error('Error during payment — please try again.');
    }
  };

  if (!bookingData) return null;

  const equipmentTotal = bookingData.equipment?.reduce((sum, e) => sum + e.price, 0) || 0;
  const gst = ((bookingData.packagePrice + equipmentTotal + handlingFee) * 0.05);

  return (
    <div>
      <Navbar />
      <div className="pt-20 max-w-2xl mx-auto">
        <div className="mt-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
          <Typography variant="h4" className="text-center font-semibold text-gray-800">
            Booking Confirmation
          </Typography>

          <table className="min-w-full table-auto mt-6 text-left">
            <tbody>
              <tr><th className="py-2 px-4">Full Name</th><td>{bookingData.fullName}</td></tr>
              <tr><th className="py-2 px-4">Email</th><td>{bookingData.email}</td></tr>
              <tr><th className="py-2 px-4">Phone</th><td>{bookingData.phone}</td></tr>
              <tr><th className="py-2 px-4">Address</th><td>{bookingData.address}</td></tr>
              <tr><th className="py-2 px-4">Date</th><td>{new Date(bookingData.date).toLocaleDateString()}</td></tr>
              <tr><th className="py-2 px-4">Package</th><td>{bookingData.packageName}</td></tr>
              <tr>
                <th className="py-2 px-4">Selected Equipment</th>
                <td>{bookingData.equipment?.length > 0 ? bookingData.equipment.map((item, index) => (<div key={index}>{item.name} (₹{item.price})</div>)) : 'None'}</td>
              </tr>
              <tr><th className="py-2 px-4">Package Price</th><td>₹{bookingData.packagePrice?.toFixed(2) || '0.00'}</td></tr>
              <tr><th className="py-2 px-4">Handling Fee</th><td>₹{handlingFee.toFixed(2)}</td></tr>
              <tr><th className="py-2 px-4">GST (5%)</th><td>₹{gst.toFixed(2)}</td></tr>
              <tr><th className="py-2 px-4">Total Price (INR)</th><td>{bookingData.totalPrice.toFixed(2)}</td></tr>
            </tbody>
          </table>

          {walletBal !== null && <Typography variant="subtitle2" className="mt-4 text-gray-600">Wallet Balance: INR {walletBal.toFixed(2)}</Typography>}
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

          <div className="flex justify-center flex-wrap gap-4 mt-8">
            {!bookingData?.isPaid && !paymentSuccess && (
              <>
                <Button onClick={handleEdit} sx={{ backgroundColor: '#1D4ED8', color: '#fff', '&:hover': { backgroundColor: '#1E40AF' } }}>Edit Booking</Button>
                <Button onClick={() => setOpenDialog(true)} sx={{ backgroundColor: '#DC2626', color: '#fff', '&:hover': { backgroundColor: '#EF4444' } }}>Delete Booking</Button>
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded" onClick={handlePayNow}>Pay Now</button>
              </>
            )}
            {(bookingData?.isPaid || paymentSuccess) && <p className="text-green-600 font-medium mt-2 text-lg flex items-center gap-2">✅ Payment Successful</p>}
            <Button onClick={() => navigate('/')} sx={{ backgroundColor: '#1E3A8A', color: '#fff', '&:hover': { backgroundColor: '#4B5563' } }}>Back to Home</Button>
          </div>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Are you sure you want to delete this booking?</DialogTitle>
            <DialogContent>
              <DialogContentText>Once deleted, you will not be able to recover this booking.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} className="text-gray-600">No</Button>
              <Button onClick={handleDelete} className="text-red-600">Yes, Delete</Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Confirmation;
