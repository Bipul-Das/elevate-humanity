// server/routes/caseRoutes.js
const express = require('express');
const router = express.Router();
const { getCases, createCase, rejectCase, provideHelp, 
  getMyCases } = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// CREATE REQUEST: Only 'Committee' (Members) can do this
router.post('/', createCase);
router.get('/my-requests', getMyCases); // <--- ADDED ROUTE

// HANDLE REQUESTS: Only Admins / Lead Dev can view and process
const adminAccess = authorize('Lead Developer', 'Admin');
router.get('/', adminAccess, getCases);
router.put('/:id/reject', adminAccess, rejectCase);
router.post('/:id/provide', adminAccess, provideHelp);

module.exports = router;