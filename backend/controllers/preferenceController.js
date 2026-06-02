const express = require('express');
const router = express.Router();
const UserPreference = require('../models/UserPreference');
const TourPackage = require('../models/tourPackage');
const authenticateToken = require('../middleware/authMiddleware');
const User = require('../models/User');

// Create User Preferences
router.post('/preferences', authenticateToken, async (req, res) => {
  const { tripPreference, days } = req.body;

  let maxDays;
  if (days === '1-3') {
    maxDays = 3;
  } else if (days === '4-7') {
    maxDays = 7;
  } else if (days === '8+') {
    maxDays = 8;
  } else {
    return res.status(400).json({ message: 'Invalid days selection' });
  }

  try {
    const newPreference = new UserPreference({
      userId: req.user.id,
      tripPreference,
      maxDays,
    });
    await newPreference.save();

    await User.findByIdAndUpdate(req.user.id, { completedOnboarding: true });
    res.status(201).json({ message: 'Preferences saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving preferences', error });
  }
});

// Get Tour Packages
router.get('/tour-packages', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const userPreferences = await UserPreference.findOne({ userId });

    if (!userPreferences) {
      return res.status(404).json({ message: 'No preferences found for this user' });
    }

    const { tripPreference, maxDays } = userPreferences;

    const packages = await TourPackage.find({
      pCategory: tripPreference,
      pDays: { $lte: maxDays },
    });

    if (packages.length === 0) {
      return res.status(404).json({ message: 'No matching tour packages found' });
    }

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tour packages', error });
  }
});

// Update User Preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  const { tripPreference, days } = req.body;

  let maxDays;
  if (days === '1-3') {
    maxDays = 3;
  } else if (days === '4-7') {
    maxDays = 7;
  } else if (days === '8+') {
    maxDays = 8;
  } else {
    return res.status(400).json({ message: 'Invalid days selection' });
  }

  try {
    const updatedPreference = await UserPreference.findOneAndUpdate(
      { userId: req.user.id },
      { tripPreference, maxDays },
      { new: true } // Return the updated document
    );

    if (!updatedPreference) {
      return res.status(404).json({ message: 'No preferences found to update' });
    }

    res.json({ message: 'Preferences updated successfully', updatedPreference });
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences', error });
  }
});

// Delete User Preferences
router.delete('/preferences', authenticateToken, async (req, res) => {
  try {
    const deletedPreference = await UserPreference.findOneAndDelete({
      userId: req.user.id,
    });

    if (!deletedPreference) {
      return res.status(404).json({ message: 'No preferences found to delete' });
    }

    res.json({ message: 'Preferences deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting preferences', error });
  }
});

module.exports = router;
