const User = require('../models/User');
const Referral = require('../models/Referral');
require('dotenv').config();


exports.getUserProfile = async (req, res) => { // Get the profile of the current user - Dinitha
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const referrals = await Referral.find({ referredUserId: userId }).populate('referringUserId', 'firstName lastName');
        const referredUsersCount = referrals.length;
        let referringUserName = referredUsersCount === 0 ? 'N/A' : referrals[0].referringUserId.firstName || 'N/A';

        const userProfile = {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            referralCode: user.referralCode,
            referringUserName: referringUserName,
            role: user.role,
            status: user.status,
        };

        res.status(200).json(userProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



