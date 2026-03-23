// server/models/Campaign.js
const mongoose = require('mongoose');
const { toTitleCase } = require('../utils/sanitizers');

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a campaign title'],
    trim: true,
    unique: true,
    set: toTitleCase // "medical fund" -> "Medical Fund"
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please add a funding goal'],
    min: [1, 'Target must be at least 1']
  },
  raisedAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Paused'],
    default: 'Active'
  },
  deadline: {
    type: Date,
    required: true
  },
  // Who created this?
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Business Logic: Check if Fully Funded
CampaignSchema.methods.checkGoalStatus = function () {
  if (this.raisedAmount >= this.targetAmount) {
    this.status = 'Completed';
    return true; // Goal Reached
  }
  return false;
};

module.exports = mongoose.model('Campaign', CampaignSchema);