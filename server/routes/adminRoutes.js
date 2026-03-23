// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  createUser,       // <--- ADDED
  updateUser,       // <--- ADDED
  deleteUser, 
  logHours,
  getApplications, 
  approveVolunteer 
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');

// Middleware to check if user is Admin/Lead Dev
const adminOnly = (req, res, next) => {
  if (req.user && ['Lead Developer', 'Org Admin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as Admin' });
  }
};

// --- GLOBAL MIDDLEWARE ---
router.use(protect);   // 1. Must be logged in
router.use(adminOnly); // 2. Must be Lead Dev or Org Admin

// --- USER & STAFF MANAGEMENT ROUTES ---
router.route('/users')
  .get(getAllUsers)       // View Roster
  .post(createUser);      // Create new Staff manually

router.route('/users/:id')
  .delete(deleteUser)     // Remove User
  .put(updateUser);       // Update Role/Details

// --- GAMIFICATION ROUTES ---
router.put('/users/:id/hours', logHours); // Log Volunteer Hours

// --- VOLUNTEER ONBOARDING ROUTES ---
router.get('/applications', getApplications);   // View Pending Apps
router.post('/approve/:id', approveVolunteer);  // Approve & Convert to User

module.exports = router;