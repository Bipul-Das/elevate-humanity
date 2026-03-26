// server/models/Case.js
const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  applicantName: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true },
  description: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['Pending', 'Helped', 'Rejected'], 
    default: 'Pending' 
  },
  
  // The logistics record: What was given to this person?
  aidProvided: [{
    itemName: String,
    quantity: Number,
    unit: String
  }],
  
  // Who created this request?
  submittedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Case', CaseSchema);