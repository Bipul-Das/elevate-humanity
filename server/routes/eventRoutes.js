// server/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { createEvent, getEvents, toggleParticipation } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All routes require login

router.get('/', getEvents);
router.post('/:id/join', toggleParticipation);

// Only Admins and Lead Dev can create events
router.post('/', authorize('Lead Developer', 'Admin'), createEvent);

module.exports = router;