// server/models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be null if it's a "Guest Donation" (optional feature)
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Donation must belong to a campaign']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: 1
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true // "tx_123" -> "TX_123"
  },
  paymentGateway: {
    type: String,
    enum: ['Stripe', 'Razorpay', 'Cash', 'BankTransfer'],
    default: 'Stripe'
  },
  // Privacy Feature: Anonymous Mode
  isAnonymous: {
    type: Boolean,
    default: false
  },
  // Status tracking
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);