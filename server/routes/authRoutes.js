const express = require('express');
const { registerUser, loginUser, verifyUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Import Guards

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// NEW: Protected Route for verifying users
// 1. Must be logged in (protect)
// 2. Must be Admin or Lead Dev (authorize)
router.put('/verify/:id', protect, authorize('Lead Developer', 'Org Admin'), verifyUser);

module.exports = router;