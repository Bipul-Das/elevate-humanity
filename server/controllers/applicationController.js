// server/controllers/applicationController.js
const Application = require('../models/Application');

// @desc    Submit a public application
// @route   POST /api/applications
// @access  Public
exports.submitApplication = async (req, res) => {
  try {
    const app = await Application.create(req.body);
    res.status(201).json({ success: true, data: app });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (Admins & Lead Dev)
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update application status (Approve/Reject)
// @route   PUT /api/applications/:id
// @access  Private (Admins & Lead Dev)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: app });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};