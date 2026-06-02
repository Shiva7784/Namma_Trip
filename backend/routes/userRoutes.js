const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { getWalletDetails } = require('../controllers/walletController');
const { getReferralDetails, submitReferralCode } = require('../controllers/referralController');
const authMiddleware = require('../middleware/authMiddleware');



router.get('/profile', authMiddleware, getUserProfile);
router.get('/wallet', authMiddleware, getWalletDetails);
router.get('/referrals', authMiddleware, getReferralDetails);
router.post('/submit-referral-code', authMiddleware, submitReferralCode);


module.exports = router;
