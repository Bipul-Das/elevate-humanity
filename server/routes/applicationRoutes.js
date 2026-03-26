// server/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { 
  submitApplication, 
  getApplications, 
  updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Route (Anyone can apply)
router.post('/', submitApplication);

// Protected Routes (Only Lead Dev and Admin can review apps)
const adminAccess = authorize('Lead Developer', 'Admin');

router.get('/', protect, adminAccess, getApplications);
router.put('/:id', protect, adminAccess, updateApplicationStatus);

module.exports = router;