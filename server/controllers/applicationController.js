// server/controllers/applicationController.js
const Application = require('../models/Application');

// @desc    Submit a Volunteer Application
// @route   POST /api/public/apply
// @access  Public
exports.submitApplication = async (req, res) => {
  try {
    const { fullName, email, phone, skills, availability, reason } = req.body;

    // Check if already applied
    const exists = await Application.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, error: 'Application already pending for this email.' });
    }

    const app = await Application.create({
      fullName,
      email,
      phone,
      skills,
      availability,
      reason
    });

    res.status(201).json({ success: true, data: app });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};