const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, default: 'razorpay' },
    order_id: { type: String, required: true, index: true },
    payment_id: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['pending', 'success', 'failure', 'cancelled'], default: 'pending' },
    error: { type: String },
    raw: { type: Object },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
