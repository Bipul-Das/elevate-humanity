// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken'); 

// @desc    Register a new user (Usually just for initial DB seeding now)
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, city, area } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // 2. Create the User
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Volunteer',
      phone,
      city: city || 'Pending', 
      area: area || 'Pending'  
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,   
        email: user.email, 
        role: user.role,
        phone: user.phone
      },
      message: 'User created successfully.' // Removed the "awaiting verification" text
    });

  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate Input
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // 2. Check for user (Select password because we hid it in Model)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`DEBUG: Login failed - User not found for email: ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // 3. Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`DEBUG: Login failed - Password did not match for: ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // REMOVED: The `!user.isVerified` check has been permanently deleted here.

    // 4. Send Token
    console.log(`DEBUG: Login SUCCESS - Welcome back ${user.name} (${user.role})`);
    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.log(`DEBUG: Login failed - Server Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper function to generate JWT and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d' 
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};