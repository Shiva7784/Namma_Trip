import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  Button,
  Chip
} from '@mui/material';
import './Booking.css';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import refundAnimation from '../../assets/Dinitha/refund-success.json';// Adjust path if needed

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRefundAnimationId, setShowRefundAnimationId] = useState(null);
  const bookingsPerPage = 5;
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    axios
      .get(url+'/api/bookings')
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const handleDelete = (id) => {
    // Trigger refund animation
    setShowRefundAnimationId(id);

    setTimeout(() => {
      axios
        .delete(url+`/api/bookings/${id}`)
        .then(() => {
          setBookings((prev) => prev.filter((booking) => booking._id !== id));
          toast.success('Booking deleted and refunded successfully');
        })
        .catch((error) => {
          console.error('Error deleting booking:', error);
          toast.error('Failed to delete booking');
        })
        .finally(() => {
          setShowRefundAnimationId(null);
        });
    }, 1500); // show animation before deleting
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      booking.phone.includes(searchPhone)
  );

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev === 1 ? prev : prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages ? prev : prev + 1));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchEmail, searchPhone]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        All Bookings
      </Typography>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <TextField
          label="Search by Email"
          variant="outlined"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          style={{ flex: 1 }}
        />
        <TextField
          label="Search by Phone"
          variant="outlined"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          style={{ flex: 1 }}
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
              <TableCell className="light-blue-column">Payment</TableCell>
              <TableCell className="light-blue-column">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentBookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.fullName}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{booking.phone}</TableCell>
                <TableCell>{booking.packageName}</TableCell>
                <TableCell>{booking.packagePrice}</TableCell>
                <TableCell>{booking.totalPrice}</TableCell>
                <TableCell>
                  {booking.date
                    ? new Date(booking.date).toISOString().split('T')[0]
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.isPaid ? 'Success' : 'Pending'}
                    color={booking.isPaid ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  {showRefundAnimationId === booking._id ? (
                    <div style={{ width: 60, height: 60 }}>
                      <Lottie animationData={refundAnimation} loop={false} />
                    </div>
                  ) : booking.isPaid ? (
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(booking._id)}
                      style={{ backgroundColor: 'red', color: '#fff' }}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Cannot delete
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {currentBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
        }}
      >
        <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Typography>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BookingList;
