// server/controllers/publicController.js
const Case = require('../models/Case');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

// @desc    Get Public Impact Stats
// @route   GET /api/public/stats
// @access  Public
exports.getPublicStats = async (req, res) => {
  try {
    // 1. Count Approved Cases (Lives Impacted)
    const casesSolved = await Case.countDocuments({ status: 'Approved' });

    // 2. Count Total Volunteers
    const volunteerCount = await User.countDocuments({ role: 'Volunteer' });

    // 3. Sum Total Donations Raised
    // We use MongoDB Aggregation to sum up the 'raisedAmount' field
    const donationStats = await Campaign.aggregate([
      { $group: { _id: null, totalRaised: { $sum: "$raisedAmount" } } }
    ]);
    const totalRaised = donationStats.length > 0 ? donationStats[0].totalRaised : 0;

    res.status(200).json({
      success: true,
      data: {
        casesSolved,
        volunteerCount,
        totalRaised
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};