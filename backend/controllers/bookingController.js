const Booking = require('../models/Booking');
const Wallet = require('../models/Wallet');


// Create a new booking
exports.createBooking = async (req, res) => {
  const {
    userId,
    fullName,
    email,
    phone,
    address,
    date,
    packageName,
    packagePrice,
    equipment,
    totalPrice,
    isPaid = false // ✅ default to false if not passed
  } = req.body;

  try {
    const newBooking = new Booking({
      userId,
      fullName,
      email,
      phone,
      address,
      date,
      packageName,
      packagePrice,
      equipment,
      totalPrice,
      isPaid // ✅ properly passed
    });

    await newBooking.save();

    res.json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating booking' });
  }
};

  
  // Update an existing booking
  exports.updateBooking = async (req, res) => {
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ error: 'Server error while updating booking' });
    }
  };

// Get booking by ID
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error); // ✅ Add this
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Delete an existing booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // If not paid, delete without refund
    if (!booking.isPaid) {
      await booking.deleteOne();
      return res.json({ message: 'Booking deleted (no payment was made, so no refund)' });
    }

    // ⬇️ Refund logic only for paid bookings
    const userId = booking.userId;
    const refundAmount = booking.totalPrice;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    wallet.walletBalance += refundAmount;

    wallet.transactionHistory.push({
      amount: refundAmount,
      type: 'Credit',
      status: 'Success',
      description: `Refund for booking cancellation (${booking.packageName})`,
      date: new Date(),
    });

    await wallet.save();
    await booking.deleteOne();

    res.json({ message: 'Booking deleted and amount refunded to wallet' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete booking and refund wallet' });
  }
};

// Get all bookings

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};


exports.markBookingPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.isPaid = true;
    await booking.save();

    res.json({ message: 'Booking marked as paid', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update booking as paid' });
  }
};
