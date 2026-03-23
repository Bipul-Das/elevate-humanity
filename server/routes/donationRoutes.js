// server/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const { getAllCampaigns, processDonation, createCampaign } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware'); // We still need this for Admin stuff

// 1. PUBLIC ROUTES (No 'protect' middleware)
router.get('/campaigns', getAllCampaigns);
router.post('/donate', processDonation); // <--- OPEN THIS UP (Remove 'protect' if it was there)

// 2. PROTECTED ROUTES (Admin Only)
router.post('/campaigns', protect, createCampaign); 

module.exports = router;