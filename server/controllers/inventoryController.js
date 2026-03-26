// server/controllers/inventoryController.js
const Inventory = require('../models/Inventory');

// @desc    Get all inventory
// @route   GET /api/inventory
// @access  Private (Admin/Committee/Volunteer)
exports.getInventory = async (req, res) => {
  try {
    // Sort alphabetically by item name
    const items = await Inventory.find().sort({ itemName: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error fetching inventory' });
  }
};

// @desc    Add new items to inventory
// @route   POST /api/inventory
// @access  Private (Admin/Committee)
exports.addItem = async (req, res) => {
  try {
    const { itemName, category, quantity, unit } = req.body;

    // 1. DUPLICATE CHECKER LOGIC
    // We check if this exact item already exists in the database
    const existingItem = await Inventory.findOne({ itemName });

    if (existingItem) {
      // If it exists, we block the creation and tell them to use the Update button
      return res.status(400).json({ 
        success: false, 
        error: `"${itemName}" already exists in the inventory. Please locate it in the table and click 'Update' to add more quantity.` 
      });
    }

    // 2. Create the new item if it doesn't exist
    const item = await Inventory.create({
      itemName,
      category,
      quantity,
      unit,
      addedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: item,
      message: 'Item added successfully'
    });
  } catch (error) {
    // Fallback: If the database's `unique: true` index catches a duplicate before our manual check does
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'This asset already exists in the inventory. Please update the existing record.' 
      });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update existing inventory item (Add/Remove quantity)
// @route   PUT /api/inventory/:id
// @access  Private (Admin/Committee)
exports.updateItem = async (req, res) => {
  try {
    // Only allow updating the quantity. (Category, Unit, and Name are fixed by the Matrix)
    const { quantity } = req.body;

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.status(200).json({
      success: true,
      data: item,
      message: 'Inventory updated successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Admin/Committee)
exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Item removed from inventory'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error during deletion' });
  }
};