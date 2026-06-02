const express = require('express');
const {getAllBookings, createBooking, getBooking, updateBooking, deleteBooking, markBookingPaid} = require('../controllers/bookingController');
const router = express.Router(); 

router.post('/', createBooking);
router.get('/:id', getBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.get('/', getAllBookings); 
router.put('/:id/mark-paid', markBookingPaid);


module.exports = router;

