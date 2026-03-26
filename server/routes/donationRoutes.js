// server/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllCampaigns, 
  processDonation, 
  createCampaign,
  getCampaignDonations,
  getAdminDonations 
} = require('../controllers/donationController');

const { protect, authorize } = require('../middleware/authMiddleware'); 

// 1. PUBLIC ROUTES (No 'protect' middleware)
router.get('/campaigns', getAllCampaigns);
router.post('/donate', processDonation); 
router.get('/campaigns/:id/donations', getCampaignDonations); // Public Masked Data

// 2. PROTECTED ROUTES (Admin Only)
const adminAccess = authorize('Lead Developer', 'Admin');

router.post('/campaigns', protect, adminAccess, createCampaign); 
router.get('/campaigns/:id/admin-donations', protect, adminAccess, getAdminDonations); // Raw Financial Data

module.exports = router;