// server/controllers/dashboardController.js
const User = require('../models/User');
const Case = require('../models/Case');
const Event = require('../models/Event');
// We use try/catch blocks for these in case you haven't created the models yet
let Campaign, Application;
try { Campaign = require('../models/Campaign'); } catch (e) {}
try { Application = require('../models/Application'); } catch (e) {}

// @desc    Get dashboard statistics for Admin/Lead Dev
// @route   GET /api/dashboard/admin-stats
// @access  Private (Admin, Lead Developer)
exports.getAdminStats = async (req, res) => {
  try {
    // 1. Fetch all basic counts concurrently for maximum speed
    const [totalUsers, newCases, upcomingEvents, activeCampaigns, pendingApps] = await Promise.all([
      User.countDocuments(),
      Case.countDocuments({ status: 'Pending' }),
      Event.countDocuments({ date: { $gte: new Date() } }),
      Campaign ? Campaign.countDocuments({ status: 'Active' }) : Promise.resolve(0),
      Application ? Application.countDocuments({ status: 'Pending' }) : Promise.resolve(0)
    ]);

    // 2. Get User Distribution by Role
    const userDistribution = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 3. Get Top 5 Provided Assets from Helped/Resolved Cases
    const topAssets = await Case.aggregate([
      { $match: { status: { $in: ['Helped', 'Resolved', 'Approved', 'Success'] } } },
      { $unwind: "$aidProvided" },
      { 
        $group: { 
          // Group by the item name, converting to lowercase to prevent duplicates (Shirts vs shirts)
          _id: { $toLower: { $ifNull: ["$aidProvided.item", "$aidProvided.itemName"] } }, 
          // Safely convert string quantities to integers for math
          totalQuantity: { 
            $sum: { $convert: { input: "$aidProvided.quantity", to: "int", onError: 0, onNull: 0 } } 
          } 
        } 
      },
      { $sort: { totalQuantity: -1 } }, // Sort highest first
      { $limit: 5 } // Top 5 only
    ]);

    res.status(200).json({
      success: true,
      data: {
        system: {
          totalUsers,
          newCases,
          upcomingEvents,
          activeCampaigns,
          pendingApps
        },
        userDistribution,
        topAssets
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard statistics' });
  }
};



// @desc    Get dashboard statistics for Members & Volunteers
// @route   GET /api/dashboard/user-stats
// @access  Private (All logged-in users)
exports.getUserStats = async (req, res) => {
  try {
    // 1. Fetch upcoming events (closest dates first, limited to 3)
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(4);

    // 2. Fetch active campaigns (newest first, limited to 3)
    let activeCampaigns = [];
    if (typeof Campaign !== 'undefined') {
      activeCampaigns = await Campaign.find({ status: 'Active' })
        .sort({ createdAt: -1 })
        .limit(4);
    }

    res.status(200).json({
      success: true,
      data: {
        upcomingEvents,
        activeCampaigns
      }
    });
  } catch (error) {
    console.error("User Dashboard Stats Error:", error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
  }
};