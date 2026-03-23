// server/controllers/caseController.js
const Case = require('../models/Case');

// @desc    Get all cases (Sorted by Priority Score: High to Low)
// @route   GET /api/cases
// @access  Private (Committee/Admin)
exports.getCases = async (req, res) => {
  try {
    // Sort by priorityScore (Descending: 10 -> 1)
    const cases = await Case.find().sort({ priorityScore: -1 });
    res.status(200).json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new Case (With Urgency Algorithm)
// @route   POST /api/cases
// @access  Public (or Volunteer)
exports.createCase = async (req, res) => {
  try {
    const { title, type, beneficiaryName, phone, description, address } = req.body;

    // --- THE URGENCY ALGORITHM ---
    let score = 1; // Default Score
    const urgentKeywords = ['starvation', 'eviction', 'surgery', 'infant', 'emergency', 'homeless', 'critical'];
    
    // Check description for keywords
    if (description) {
        const lowerDesc = description.toLowerCase();
        urgentKeywords.forEach(word => {
          if (lowerDesc.includes(word)) score += 2; // Add 2 points per keyword
        });
    }

    // Cap score at 10
    if (score > 10) score = 10;

    const newCase = await Case.create({
      title,
      type,
      beneficiaryName, // Saves as simple string now
      phone,
      description,
      address,
      priorityScore: score,
      status: 'Pending',
      createdBy: req.user ? req.user.id : null 
    });

    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    console.error("Create Case Error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update Case Status (Approve/Reject)
// @route   PUT /api/cases/:id/status
// @access  Private (Admin/Committee)
exports.updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    
    const caseItem = await Case.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true, runValidators: true }
    );

    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    res.status(200).json({ success: true, data: caseItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};