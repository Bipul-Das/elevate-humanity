// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  createUser,
  updateUser,
  deleteUser, 
  getApplications, 
  approveVolunteer 
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @desc   Middleware to allow only Lead Developer and Admin roles.
 * We updated 'Org Admin' to 'Admin' to match your new schema.
 */
const adminOnly = authorize('Lead Developer', 'Admin');

// --- GLOBAL MIDDLEWARE ---
router.use(protect);   // 1. Must be logged in
router.use(adminOnly); // 2. Must be Lead Dev or Admin

// --- USER & STAFF MANAGEMENT ROUTES ---
// Handles the primary Staff Management table
router.route('/users')
  .get(getAllUsers)       // View Roster
  .post(createUser);      // Manually provision new Staff/Volunteers

router.route('/users/:id')
  .put(updateUser)        // Update User Role or Details
  .delete(deleteUser);    // Remove User from system

// --- APPLICATION & ONBOARDING ROUTES ---
// Handles the processing of public applications
router.get('/applications', getApplications);   // View Pending Apps
router.post('/approve/:id', approveVolunteer);  // Approve & Convert to User

// NOTE: Gamification/logHours route has been permanently removed.

module.exports = router;