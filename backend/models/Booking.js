const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: {
    type: String,
    required: [true, 'Full Name is required'],
    minlength: [2, 'Full Name must be at least 2 characters'],
    maxlength: [50, 'Full Name must be less than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    minlength: [5, 'Address must be at least 5 characters'],
    maxlength: [100, 'Address must be less than 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required'],
  },
  packageName: {
    type: String,
    required: [true, 'Package Name is required'],
    minlength: [3, 'Package Name must be at least 3 characters']
  },
  packagePrice: {
    type: Number,
    required: [true, 'Package Price is required'],
    min: [0, 'Package Price must be a positive number']
  },
  equipment: [{
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
    },
    price: {
      type: Number,
      required: [true, 'Equipment price is required'],
      min: [0, 'Equipment price must be a positive number']
    }
  }],

  totalPrice: {
    type: Number,
    required: [true, 'Total Price is required'],
    min: [0, 'Total Price must be a positive number']
  },

  isPaid: { 
    type: Boolean, 
    default: false 
  }
});


// Check if model exists before creating it
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
module.exports = Booking;

