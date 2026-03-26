// server/models/Inventory.js
const mongoose = require('mongoose');
const { toTitleCase } = require('../utils/sanitizers'); // Reuse our hygiene tools

const InventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please add item name'],
    unique: true, // <-- CRITICAL UPDATE: Enforces the "No Duplicates" rule at the database level
    trim: true,
    set: toTitleCase 
  },
  category: {
    type: String,
    enum: ['Clothes', 'Foods', 'Cash', 'Shelter'], // Strictly matched to UI Tabs
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    default: 'pcs', // pcs, kg, $, beds
    trim: true
  },
  location: {
    type: String,
    default: 'Main Warehouse',
    trim: true
  },
  lowStockThreshold: {
    type: Number,
    default: 10 // Alert trigger point
  },
  // Audit Trail: Who added this stock?
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true, 
  toJSON: { virtuals: true },  // Include virtuals in JSON
  toObject: { virtuals: true } // Include virtuals in Objects
});

// Virtual Field: Check if Stock is Low
InventorySchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.lowStockThreshold;
});

module.exports = mongoose.model('Inventory', InventorySchema);