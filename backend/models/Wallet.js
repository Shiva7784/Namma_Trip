const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    walletBalance: { type: Number, required: true, default: 0 },
    transactionHistory: [
        {
            amount: { type: Number, required: true },
            type: {
                type: String,
                enum: ['Referral bonus', 'Welcome bonus', 'Purchase', 'Credit', 'Debit', 'Top-up'],
                required: true
            },
            date: { type: Date, required: true, default: Date.now },
            status: { type: String, enum: ['Success', 'Failed'] }
        }
    ]
    
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;
