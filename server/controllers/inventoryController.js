// server/controllers/inventoryController.js
const Inventory = require('../models/Inventory');

// @desc    Add new items to inventory
// @route   POST /api/inventory
// @access  Private (Admin/Committee)
exports.addItem = async (req, res) => {
  try {
    // Lead Dev Note: The Model automatically handles "b23" -> "B23" conversion
    const item = await Inventory.create({
      ...req.body,
      addedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: item,
      message: 'Item added successfully'
    });
  } catch (error) {
    // Duplicate Key Error (Same Batch Number)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Batch Number already exists!' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all inventory (FIFO: Expiring First)
// @route   GET /api/inventory
// @access  Private (Volunteer/Admin)
exports.getInventory = async (req, res) => {
  try {
    // Sort by Expiry Date (Ascending) -> Oldest stuff first
    const items = await Inventory.find().sort({ expiryDate: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Redeem Item via QR Scan (Decrement Stock)
// @route   POST /api/inventory/redeem
// @access  Private (Volunteer/Admin)
exports.redeemItem = async (req, res) => {
  try {
    const { batchNumber, quantityToRedeem } = req.body;
    const qty = quantityToRedeem || 1; // Default to 1 item

    // 1. Find the item by Batch Code
    // Note: We use uppercase() here just in case, though frontend should handle it
    const item = await Inventory.findOne({ batchNumber: batchNumber.toUpperCase() });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item/Batch not found' });
    }

    // 2. Check Availability
    if (item.quantity < qty) {
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient stock. Only ${item.quantity} left.` 
      });
    }

    // 3. Decrement Stock (Live Tracking)
    item.quantity = item.quantity - qty;
    await item.save();

    // 4. Check for Low Stock Alert
    let alertMsg = null;
    if (item.quantity <= item.lowStockThreshold) {
      alertMsg = `⚠️ WARNING: Low Stock! Only ${item.quantity} remaining.`;
    }

    res.status(200).json({
      success: true,
      data: {
        itemName: item.itemName,
        remainingQuantity: item.quantity,
        redeemed: qty
      },
      message: 'Redemption Successful',
      alert: alertMsg // Frontend can show this as a Yellow Toast
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};