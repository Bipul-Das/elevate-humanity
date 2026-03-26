// server/models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  // Link to a registered user (Optional, for Guests)
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false 
  },
  
  // NEW: Hardcoded donor info. 
  // Crucial for Guest donations or if a User deletes their account later.
  donorName: {
    type: String,
    required: [true, 'Please provide the donor name'],
    trim: true
  },
  donorEmail: {
    type: String,
    required: false,
    lowercase: true,
    trim: true
  },

  // Link to the specific Campaign
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Donation must belong to a campaign']
  },
  
  // Financial Details
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [1, 'Minimum donation is $1']
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