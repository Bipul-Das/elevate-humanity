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
  
  // --- STRICT PHONE VALIDATION ---
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
    match: [
      /^10\d{5}$/, 
      'Phone number must be exactly 7 digits and start with 10'
    ]
  },

  // --- LOCATION DATA ---
  city: {
    type: String,
    required: [true, 'Please add a city'],
    trim: true,
    set: toTitleCase
  },
  area: {
    type: String,
    required: [true, 'Please add an area'],
    trim: true,
    set: toTitleCase
  },

  // --- SIMPLIFIED ROLE MATRIX ---
  role: {
    type: String,
    // Strictly enforced roles based on the new business logic
    enum: ['Lead Developer', 'Admin', 'Member', 'Volunteer'],
    default: 'Volunteer' 
  }

}, { timestamps: true });

// --- PASSWORD ENCRYPTION ---
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- HELPER METHOD: CHECK PASSWORD ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);