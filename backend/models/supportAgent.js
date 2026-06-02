const mongoose = require('mongoose');

const supportAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Support', 'Technician'],
  },

});

module.exports = mongoose.model('SupportAgent', supportAgentSchema);
