import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, CircularProgress, Pagination, Button
} from '@mui/material';
import './Booking.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import 'jspdf-autotable';

const UserBooking = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 4;
  const navigate = useNavigate();
  const handlingFee = 1000;
  const [walletBal, setWalletBal] = useState(null);


  const url=import.meta.env.BACKEND_URL;
  const url1=import.meta.env.FRONTEND_URL;
  const url2=import.meta.env.production_url;


  console.log('url is',url);
  console.log('url1 is',url1);
  console.log('url2 is',url2);




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

  useEffect(() => {
    axios.get(url+'/api/user/profile', { withCredentials: true })
      .then(response => {
        setUser(response.data);
        setLoadingUser(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoadingUser(false);
      });
  }, []);

  useEffect(() => {
    if (!user) return;

    axios.get(url+'/api/bookings', { withCredentials: true })
      .then(response => {
        setBookings(response.data);
        setLoadingBookings(false);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setLoadingBookings(false);
      });
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loadingUser || loadingBookings) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '50px' }}>
        <CircularProgress />
        <Typography>Loading your bookings...</Typography>
      </div>
    );
  }

  if (!user) {
    return <Typography>Please log in to view your bookings.</Typography>;
  }

  const filteredBookings = bookings
    .filter((booking) => booking.userId.toString() === user.userId)
    .filter((booking) => {
      const term = searchTerm.toLowerCase();
      return (
        booking.fullName.toLowerCase().includes(term) ||
        booking.email.toLowerCase().includes(term) ||
        booking.packageName.toLowerCase().includes(term)
      );
    });

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  const handlePayNow = async (bookingData) => {
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

      
      // 5. Update booking status in local state
      setBookings(prev =>
        prev.map(b =>
        b._id === bookingData._id ? { ...b, isPaid: true } : b
      )
    );
  
      // 6. Final Toast
      toast.success('Payment successful — receipt downloaded & booking marked paid.');
      //setPaymentSuccess(true);
    } catch (err) {
      console.error('Payment Error:', err);
      toast.error('Error during payment — please try again.');
    }
  };


  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>My Bookings</Typography>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name, email or package..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="light-blue-column">Full Name</TableCell>
              <TableCell className="light-blue-column">Email</TableCell>
              <TableCell className="light-blue-column">Phone</TableCell>
              <TableCell className="light-blue-column">Package Name</TableCell>
              <TableCell className="light-blue-column">Package Price</TableCell>
              <TableCell className="light-blue-column">Total Price</TableCell>
              <TableCell className="light-blue-column">Date</TableCell>
              <TableCell className="light-blue-column">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  You have no bookings yet.
                </TableCell>
              </TableRow>
            ) : (
              paginatedBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.fullName}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.phone}</TableCell>
                  <TableCell>{booking.packageName}</TableCell>
                  <TableCell>{`Rs ${booking.packagePrice.toLocaleString()}`}</TableCell>
                  <TableCell>{`Rs ${booking.totalPrice.toLocaleString()}`}</TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {booking.isPaid ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Payment Success</span>
                    ) : (
                      <>
                        <span style={{ color: 'red', fontWeight: 'bold', marginRight: '8px' }}>
                          Payment Pending
                        </span>
                        <Button
                          onClick={() => handlePayNow(booking)}
                          sx={{
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            fontWeight: '500',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#dc2626',
                            },
                          }}
                        >
                          Pay Now
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredBookings.length > bookingsPerPage && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(filteredBookings.length / bookingsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
          />
        </div>
      )}
    </div>
  );
};

export default UserBooking;
