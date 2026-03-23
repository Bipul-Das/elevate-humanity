// server/controllers/donationController.js
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

// @desc    Create a new Campaign
// @route   POST /api/campaigns
// @access  Private (Admin Only)
exports.createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// server/controllers/donationController.js

// server/controllers/donationController.js

exports.processDonation = async (req, res) => {
  try {
    const { campaignId, amount, isAnonymous, paymentMethod } = req.body;

    // 1. Check Campaign
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    if (new Date(campaign.deadline) < new Date()) {
      return res.status(400).json({ error: 'Campaign has ended' });
    }

    // 2. Identify Donor (User ID or null for Guest)
    const donorId = req.user ? req.user.id : null;

    // 3. GENERATE FAKE TRANSACTION ID (The Fix)
    // In a real app, Stripe gives us this. Here, we fake it.
    const fakeTxnId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 4. Create Donation Record
    const donation = await Donation.create({
      donor: donorId,
      campaign: campaignId,
      amount,
      isAnonymous: donorId ? isAnonymous : true,
      paymentMethod: paymentMethod || 'Credit Card',
      transactionId: fakeTxnId // <--- ADDED THIS FIELD
    });

    // 5. Update Campaign Total
    campaign.raisedAmount += Number(amount);
    await campaign.save();

    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    console.error("Donation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get Public Donations for a Campaign
// @route   GET /api/donations/campaign/:id
// @access  Public
exports.getCampaignDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ 
      campaign: req.params.id, 
      status: 'Success' 
    })
    .populate('donor', 'name') // Get donor name
    .sort({ createdAt: -1 });

    // Handle "Anonymous Mode" logic for public view
    const publicData = donations.map(d => ({
      amount: d.amount,
      donorName: d.isAnonymous ? "Anonymous Donor" : d.donor.name, // The Mask
      date: d.createdAt
    }));

    res.status(200).json({ success: true, count: publicData.length, data: publicData });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get All Active Campaigns
// @route   GET /api/finance/campaigns
// @access  Public
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};