// server/models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { 
    type: String, 
    required: true,
    match: [/^10\d{5}$/, 'Phone number must be exactly 7 digits and start with 10']
  },
  city: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  roleRequested: { 
    type: String, 
    enum: ['Member', 'Volunteer'], 
    required: true 
  },
  motivation: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);