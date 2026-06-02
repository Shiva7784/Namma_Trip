const Referral = require('../models/Referral');
const User = require('../models/User'); 
const Wallet = require('../models/Wallet');

exports.getReferralDetails = async (req, res) => { // Get the referral details of the current user - Dinitha
    try {
        const userId = req.user.id;

        
        const referrals = await Referral.find({ referringUserId: userId });
        if (!referrals || referrals.length === 0) {
            return res.status(404).json({ message: 'No referrals found' });
        }

        res.status(200).json(referrals);
    } catch (err) {
        console.error(err); 
        res.status(403).json({ message: 'Forbidden' });
    }
};


exports.submitReferralCode = async (req, res) => { // Submit the referral code and apply the referral bonus - Dinitha
    try {
        const { referralCode } = req.body;
        const userId = req.user.id;

        const currentUser = await User.findById(userId);

        if (currentUser.referralCode === referralCode) {
            return res.status(400).json({ message: 'You cannot use your own referral code.' });
        }

        const referringUser = await User.findOne({ referralCode });
        if (!referringUser) {
            return res.status(400).json({ message: 'Invalid referral code' });
        }

        const referringUserWallet = await Wallet.findOne({ userId: referringUser._id });
        const newUserWallet = await Wallet.findOne({ userId });

        const referralBonus = 1000;
        if (referringUserWallet) {
            referringUserWallet.walletBalance += referralBonus;
            referringUserWallet.transactionHistory.push({
                amount: referralBonus,
                type: 'Referral bonus',
                date: new Date(),
                status: 'Success'
            });
            await referringUserWallet.save();
        }

        const welcomeBonus = 1000;
        if (newUserWallet) {
            newUserWallet.walletBalance += welcomeBonus;
            newUserWallet.transactionHistory.push({
                amount: welcomeBonus,
                type: 'Welcome bonus',
                date: new Date(),
                status: 'Success'
            });
            await newUserWallet.save();
        }

        const referral = new Referral({
            referredUserId: userId,
            referredUserName: `${currentUser.firstName} ${currentUser.lastName}`,
            referringUserId: referringUser._id,
            referringUserName: `${referringUser.firstName} ${referringUser.lastName}`,
            date: new Date(),
            status: 'Success'
        });

        await referral.save();

        res.status(200).json({ message: 'Referral code applied successfully', status: 'Success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', status: 'Error' });
    }
};


