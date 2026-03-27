// server/routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const { getLandingStats } = require('../controllers/publicController');

// Open public route (No auth middleware required)
router.get('/stats', getLandingStats);

module.exports = router;