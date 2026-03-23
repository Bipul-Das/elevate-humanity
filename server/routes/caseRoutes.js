// server/routes/caseRoutes.js
const express = require('express');
const router = express.Router();
const { getCases, createCase, updateCaseStatus } = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');

// Route: /api/cases
router.route('/')
  .get(protect, getCases)      // GET all cases
  .post(protect, createCase);  // POST new case

// Route: /api/cases/:id/status
router.route('/:id/status')
  .put(protect, updateCaseStatus); // Update status

module.exports = router;