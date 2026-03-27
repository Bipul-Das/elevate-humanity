// server/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getAdminStats, getUserStats } = require('../controllers/dashboardController'); // <--- Import getUserStats
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Admin specific stats
router.get('/admin-stats', authorize('Lead Developer', 'Admin'), getAdminStats);

// NEW: Standard user stats (Accessible by everyone who is logged in)
router.get('/user-stats', getUserStats);

module.exports = router;