// server/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/register
// @access  Public (Used for initial DB seeding or adding the first Lead Dev)
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

module.exports = router;