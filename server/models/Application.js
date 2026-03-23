// server/models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Prevent duplicate applications
  phone: { type: String, required: true },
  
  // What are they good at?
  skills: { 
    type: String, 
    enum: ['Medical', 'Teaching', 'Logistics/Driving', 'General Helper', 'Tech/Admin'],
    default: 'General Helper'
  },
  
  // When can they work?
  availability: { type: String, required: true }, // e.g., "Weekends only"
  
  reason: { type: String, required: true }, // "Why do you want to join?"
  
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);