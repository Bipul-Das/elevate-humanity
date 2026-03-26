// server/controllers/caseController.js
const Case = require('../models/Case');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

// @desc    Get all requests
// @route   GET /api/cases
// @access  Private (Admins / Lead Dev)
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch requests' });
  }
};

// @desc    Create a new help request
// @route   POST /api/cases
// @access  Private (Committee Members Only)
exports.createCase = async (req, res) => {
  try {
    // 1. Fetch the user's full profile using their secure token ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found' });
    }

    if (!req.body.description) {
      return res.status(400).json({ success: false, error: 'Description is required' });
    }

    // 2. Stitch the Case together using the User's database info + the submitted description
    const newCase = await Case.create({
      applicantName: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      area: user.area,
      description: req.body.description,
      submittedBy: user._id
    });

    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Reject a request
// @route   PUT /api/cases/:id/reject
// @access  Private (Admins / Lead Dev)
exports.rejectCase = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to reject case' });
  }
};

// @desc    Provide Help (Deduct Inventory & Update Case)
// @route   POST /api/cases/:id/provide
// @access  Private (Admins / Lead Dev)
exports.provideHelp = async (req, res) => {
  try {
    const { providedItems } = req.body; // Array: [{ inventoryId, itemName, quantity, unit }]
    const caseId = req.params.id;

    // 1. Validation Check: Ensure we have enough stock BEFORE deducting anything
    for (let item of providedItems) {
      const stock = await Inventory.findById(item.inventoryId);
      if (!stock || stock.quantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient stock for ${item.itemName}. Only ${stock ? stock.quantity : 0} left.` 
        });
      }
    }

    // 2. Execution: Deduct the stock
    for (let item of providedItems) {
      await Inventory.findByIdAndUpdate(item.inventoryId, {
        $inc: { quantity: -Math.abs(item.quantity) } // Decrease quantity
      });
    }

    // 3. Mark Case as Helped & Attach Record
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { 
        status: 'Helped',
        aidProvided: providedItems.map(i => ({ itemName: i.itemName, quantity: i.quantity, unit: i.unit }))
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedCase, message: 'Help provided and inventory updated!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add this new function to server/controllers/caseController.js

// @desc    Get logged-in user's help requests
// @route   GET /api/cases/my-requests
// @access  Private (All logged-in users)
exports.getMyCases = async (req, res) => {
  try {
    const cases = await Case.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ 
      success: true, 
      count: cases.length, 
      data: cases 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};