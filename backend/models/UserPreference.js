const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripPreference: {
    type: String,
    enum: ['Adventure Tours', 'Wildlife and Nature Tours', 'Cultural Tours', 'Iconic Tours'],
    required: true
  },
  
  maxDays: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);
module.exports = UserPreference;
