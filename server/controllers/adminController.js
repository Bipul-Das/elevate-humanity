// server/controllers/adminController.js
const User = require('../models/User');
const Application = require('../models/Application');

// @desc    Get All Users (Roster)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get Pending Applications
// @route   GET /api/admin/applications
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find({ status: 'Pending' });
    res.status(200).json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Approve Volunteer (Convert App -> User)
// @route   POST /api/admin/approve/:id
exports.approveVolunteer = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // 1. Check if email already exists
    const userExists = await User.findOne({ email: app.email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    // 2. Create the User
    // NOTE: In a real app, we would email them a reset link. 
    // Here, we set a default temp password: "Welcome123"
    const newUser = await User.create({
      name: app.fullName,
      email: app.email,
      phone: app.phone,
      password: 'Welcome123', 
      role: 'Volunteer',
      skills: [app.skills], // Import their skill
      availability: app.availability,
      // Fallbacks since Application form doesn't have these fields yet
      city: 'Pending', 
      area: 'Pending'
    });

    // 3. Delete the Application (Clean up)
    await Application.findByIdAndDelete(req.params.id);

    res.status(201).json({ 
      success: true, 
      message: `User created! Temp Password: Welcome123`,
      data: newUser 
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete User (CRUD)
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Log Hours & Update Badges (Gamification)
// @route   PUT /api/admin/users/:id/hours
exports.logHours = async (req, res) => {
  try {
    const { hours } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update Hours
    user.hoursLogged += Number(hours);

    // BADGE LOGIC ("Guardian System")
    if (user.hoursLogged >= 10 && !user.badges.includes('Bronze Helper')) {
      user.badges.push('Bronze Helper');
    }
    if (user.hoursLogged >= 50 && !user.badges.includes('Community Pillar')) {
      user.badges.push('Community Pillar');
    }

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new User manually (Staff onboarding)
// @route   POST /api/admin/users
exports.createUser = async (req, res) => {
  try {
    // FIXED: Extract city and area from req.body
    const { name, email, phone, role, password, city, area } = req.body;

    // Check duplicate
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const user = await User.create({
      name,
      email,
      phone,
      city, // FIXED: Save to DB
      area, // FIXED: Save to DB
      password: password || 'Elevate123', // Default password if none provided
      role,
      isVerified: true // Staff created by Admin are auto-verified
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update User Details (Promote/Demote)
// @route   PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    // FIXED: Extract city and area from req.body
    const { name, email, role, phone, city, area } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { name, email, role, phone, city, area }, // FIXED: Pass to DB
      { new: true, runValidators: true } // FIXED: runValidators ensures regex/rules run
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};