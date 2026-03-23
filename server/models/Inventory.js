// server/models/Inventory.js
const mongoose = require('mongoose');
const { toTitleCase, toUpperCase } = require('../utils/sanitizers'); // Reuse our hygiene tools

const InventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please add item name'],
    trim: true,
    set: toTitleCase // "rice bag" -> "Rice Bag"
  },
  category: {
    type: String,
    enum: ['Food', 'Medicine', 'Clothes', 'Bibles', 'General', 'Education'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    default: 'pcs', // pcs, kg, boxes
    trim: true
  },
  batchNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // Auto-UPPERCASE ("b23" -> "B23")
    unique: true // No two batches can have the same ID
  },
  expiryDate: {
    type: Date,
    required: false // Not needed for Bibles/Clothes
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
  toJSON: { virtuals: true },  // <--- ADD THIS (Include virtuals in JSON)
  toObject: { virtuals: true } // <--- ADD THIS (Include virtuals in Objects)
});

// Virtual Field: Check if Stock is Low
InventorySchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.lowStockThreshold;
});

module.exports = mongoose.model('Inventory', InventorySchema);