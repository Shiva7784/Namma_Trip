const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const User = require('../models/User');
const Wallet = require('../models/Wallet'); 

router.get('/', async (req, res) => { // Get all referrals - Dinitha
    try {
        const referrals = await Referral.find().populate('referredUserId referringUserId');
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/toggle-status', async (req, res) => {  // Toggle the status of a referral - Dinitha
    const { referralId, newStatus } = req.body;

    try {
        const referral = await Referral.findById(referralId);
        if (!referral) return res.status(404).json({ message: 'Referral not found' });

       
        referral.status = newStatus;
        await referral.save();

       
        if (newStatus === 'Success') {
     
            await Wallet.updateOne(
                { userId: referral.referringUserId },
                { $inc: { walletBalance: 1000 } }
            );
            await Wallet.updateOne(
                { userId: referral.referredUserId },
                { $inc: { walletBalance: 1000 } }
            );
        } else if (newStatus === 'Suspended') {
            
            await Wallet.updateOne(
                { userId: referral.referringUserId },
                { $inc: { walletBalance: -1000 } }
            );
            await Wallet.updateOne(
                { userId: referral.referredUserId },
                { $inc: { walletBalance: -1000 } }
            );
        }

        res.status(200).json(referral);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:referralId', async (req, res) => { // Delete a referral - Dinitha
    const { referralId } = req.params;

    try {
        const referral = await Referral.findById(referralId);
        if (!referral) return res.status(404).json({ message: 'Referral not found' });

        
        await Wallet.updateOne(
            { userId: referral.referringUserId },
            { $inc: { walletBalance: -1000 } }
        );

        await Wallet.deleteOne({ _id: referralId });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
