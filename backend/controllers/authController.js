const express = require('express');

const User = require('../models/User');
const Referral = require('../models/Referral');
const Wallet = require('../models/Wallet');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const app = express();

app.use(CookieParser());

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, referralCode } = req.body;

    try {
        if (!(email && password && firstName && lastName)) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let validReferralCode = null;
        if (referralCode) {
            validReferralCode = await User.findOne({ referralCode });
            if (!validReferralCode) {
                return res.status(400).json({ message: 'Referral code is not valid. Please check it again or register without the referral code.' });
            }
        }

        const newReferralCode = uuidv4().split('-')[0].toUpperCase();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email: normalizedEmail,
            password: hashedPassword,
            referralCode: newReferralCode,
            completedOnboarding: false
        });

        await newUser.save();

        const newWallet = new Wallet({
            userId: newUser._id,
            walletBalance: 0,
            transactionHistory: []
        });

        await newWallet.save(); 

        if (validReferralCode) {
            const referringUserWallet = await Wallet.findOne({ userId: validReferralCode._id });
            if (referringUserWallet) {
                const transactionAmount = 1000;

                referringUserWallet.walletBalance += transactionAmount;
                referringUserWallet.transactionHistory.push({
                    amount: transactionAmount,
                    type: 'Referral bonus',
                    date: new Date(),
                    status: 'Success'
                });

                await referringUserWallet.save();

                const transactionBonus = 1000;
                newWallet.walletBalance += transactionBonus;
                newWallet.transactionHistory.push({
                    amount: transactionBonus,
                    type: 'Welcome bonus',
                    date: new Date(),
                    status: 'Success'
                });

                await newWallet.save();

                const referral = new Referral({
                    referredUserId: newUser._id,
                    referredUserName: `${newUser.firstName} ${newUser.lastName}`,
                    referringUserId: validReferralCode._id,
                    referringUserName: `${validReferralCode.firstName} ${validReferralCode.lastName}`,
                    date: new Date(),
                    status: 'Success'
                });

                await referral.save();
            }
        }

        generateTokenAndSetCookie(newUser, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const generateTokenAndSetCookie = (user, res) => {
    const token = jwt.sign(
        { id: user._id, role: user.role, completedOnboarding: user.completedOnboarding, status: user.status },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
       .json({ 
           user,
           token,
       });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!(email && password)) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ message: 'No account is matching for this email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Please re-check your password' });
        }

        generateTokenAndSetCookie(user, res);

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = { registerUser, loginUser, logoutUser };
