const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/publicController');
const { submitApplication } = require('../controllers/applicationController'); // <--- Import this

router.get('/stats', getPublicStats);
router.post('/apply', submitApplication); // <--- Add this Route

module.exports = router;