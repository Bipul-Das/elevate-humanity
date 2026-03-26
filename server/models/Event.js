// server/models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  
  // Track participants separately based on their roles
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);