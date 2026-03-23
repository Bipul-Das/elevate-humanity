// server/routes/inventoryRoutes.js
const express = require('express');
const { addItem, getInventory, redeemItem } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Apply Protection to ALL inventory routes
router.use(protect); 

// 2. Define Routes
// Everyone (Volunteers+) can VIEW items
router.get('/', getInventory);

// Only Admins/Committee can ADD items
router.post('/', authorize('Lead Developer', 'Org Admin', 'Committee'), addItem);

// Volunteers & Admins can REDEEM (Scan QR)
router.post('/redeem', authorize('Lead Developer', 'Org Admin', 'Volunteer'), redeemItem);

module.exports = router;