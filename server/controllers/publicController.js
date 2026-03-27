// server/controllers/publicController.js
const User = require('../models/User');
const Case = require('../models/Case');

// Safely import Campaign model (Prevents crashes if the schema isn't fully built yet)
let Campaign;
try { 
  Campaign = require('../models/Campaign'); 
} catch (e) {
  console.warn("Notice: Campaign model not found. Funds raised will only use base numbers.");
}

// Estimated Market Values for calculation (in USD)
const MARKET_VALUES = {
  // Clothes
  "Shirts": 10, "Pants": 15, "Skirts": 12, "Jackets": 30, "Socks": 2, "Shoes": 20,
  "Sweaters": 25, "Dresses": 20, "Blankets": 15, "Coats": 40, "Gloves": 5, "Hats": 8,
  "Scarves": 8, "Undergarments": 3, "Belts": 10,
  // Foods
  "Rice": 1.5, "Lentils": 2, "Flour": 1, "Milk": 1.2, "Oil": 3, "Sugar": 1.5,
  "Salt": 0.5, "Canned Beans": 1.5, "Canned Fish": 2.5, "Bottled Water": 1,
  "Potatoes": 1, "Onions": 1, "Pasta": 2, "Bread": 2, "Biscuits": 1.5,
  // Shelter
  "Beds": 150, "Family Rooms": 300
};

// @desc    Get public landing page statistics
// @route   GET /api/public/stats
// @access  Public
exports.getLandingStats = async (req, res) => {
  try {
    // 1. BASE STARTING NUMBERS (Ensures the platform looks established from Day 1)
    let stats = {
      livesImpacted: 1240,
      totalValueDistributed: 45000, 
      fundsRaised: 12500,
      activeVolunteers: 85,
      networkMembers: 310
    };

    // 2. FETCH REAL DATABASE COUNTS (Users & Cases)
    const [userCount, volunteerCount, caseCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'Volunteer' }),
      Case.countDocuments()
    ]);

    stats.networkMembers += userCount;
    stats.activeVolunteers += volunteerCount;
    stats.livesImpacted += caseCount;

    // 3. CALCULATE OUTFLOW: REAL-WORLD VALUE OF DONATIONS DISTRIBUTED
    const resolvedCases = await Case.find({ 
      status: { $in: ['Resolved', 'Helped', 'Approved', 'Success'] } 
    });

    resolvedCases.forEach(c => {
      if (c.aidProvided && Array.isArray(c.aidProvided)) {
        c.aidProvided.forEach(aid => {
          const itemName = aid.item || aid.itemName;
          const qty = Number(aid.quantity) || 0;

          if (itemName === 'USD') {
            stats.totalValueDistributed += qty;
            // Removed stats.fundsRaised += qty; because giving out money is an outflow, not an inflow.
          } else {
            const price = MARKET_VALUES[itemName] || 5; 
            stats.totalValueDistributed += (qty * price);
          }
        });
      }
    });

    // 4. CALCULATE INFLOW: TOTAL FUNDS RAISED FROM CAMPAIGNS
    if (Campaign) {
      const campaignFunds = await Campaign.aggregate([
        { 
          $group: { 
            _id: null, 
            // Change "raisedAmount" to whatever field name your Campaign schema uses to track money
            totalCapital: { $sum: "$raisedAmount" } 
          } 
        }
      ]);

      if (campaignFunds.length > 0 && campaignFunds[0].totalCapital) {
        stats.fundsRaised += campaignFunds[0].totalCapital;
      }
    }

    res.status(200).json({ success: true, data: stats });

  } catch (error) {
    console.error("Public Stats Error:", error);
    // Graceful fallback to base numbers to ensure 100% uptime for the landing page
    res.status(500).json({ 
      success: false, 
      data: { livesImpacted: 1240, totalValueDistributed: 45000, fundsRaised: 12500, activeVolunteers: 85, networkMembers: 310 } 
    });
  }
};