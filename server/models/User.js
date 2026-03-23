// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toTitleCase } = require('../utils/sanitizers'); // Keep your existing helper

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    set: toTitleCase // Keeps your "jemma smith" -> "Jemma Smith" logic
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Security feature
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true
  },
  role: {
    type: String,
    enum: ['Lead Developer', 'Org Admin', 'Committee', 'Volunteer', 'Donor', 'Beneficiary'],
    default: 'Volunteer' // Changed default from Beneficiary to Volunteer for this phase
  },
  isVerified: {
    type: Boolean,
    default: false 
  },

  // --- NEW FIELDS FOR MODULE 6 (Workforce) ---
  skills: {
    type: [String], // e.g., ["Medical", "Driving"]
    default: []
  },
  
  availability: {
    type: String, // e.g., "Weekends only"
    default: ''
  },

  // --- NEW FIELDS FOR GAMIFICATION ---
  hoursLogged: {
    type: Number,
    default: 0
  },
  badges: {
    type: [String], // e.g., ["Bronze Helper", "Community Pillar"]
    default: []
  }

}, { timestamps: true });

// --- PASSWORD ENCRYPTION (Modern Async/Await version) ---
UserSchema.pre('save', async function () {
  // 1. If password is not modified, stop
  if (!this.isModified('password')) {
    return;
  }

  // 2. Generate Salt & Hash
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- HELPER METHOD: CHECK PASSWORD ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);