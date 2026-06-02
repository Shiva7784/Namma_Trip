const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/', async (req, res) => { // Get all users - Dinitha
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:userId/suspend', async (req, res) => { // Suspend or activate a user - Dinitha
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = user.status === 'suspended' ? 'active' : 'suspended';
    await user.save();

    res.status(200).json({ message: `User ${user.status === 'suspended' ? 'suspended' : 'activated'} successfully.`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:userId/update', async (req, res) => { // Update user details - Dinitha
    try {
      const userId = req.params.userId;
      const { email, firstName, lastName } = req.body;
  
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
          return res.status(400).json({ message: 'User email is already registered' });
        }
      }
  
      const updatedData = { email, firstName, lastName }; 
      const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.put('/:userId/role', async (req, res) => { // Update user role - Dinitha
  try {
    const userId = req.params.userId;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/:userId/delete', async (req, res) => { // Delete a user - Dinitha
    try {
      const userId = req.params.userId;
  
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
