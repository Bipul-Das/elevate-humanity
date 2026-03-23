// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import JWT to generate tokens

// @desc    Register a new user (Eventually Admin only)
// @route   POST /api/auth/register
// @access  Public (For now, to seed the Lead Dev)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // 2. Create the User
    // The 'set' functions in the Model will handle TitleCase and Lowercase automatically!
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Beneficiary', // Default to Beneficiary if not specified
      phone
    });

    // 3. Respond (But NEVER send back the password)
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,   // We want to see if "jemma" became "Jemma"
        email: user.email, // We want to see if "Upper" became "lower"
        role: user.role,
        phone: user.phone
      },
      message: 'User created successfully. Awaiting Admin verification.'
    });

  } catch (error) {
    // Catch Mongoose Validation Errors (like invalid email format)
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

    // 1. Validate Input (Basic check)
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // 2. Check for user (Select password because we hid it in Model)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // ... inside loginUser, after finding the user ...

    // NEW: Check if account is verified (Skip check for Lead Dev to avoid lockout)
    if (!user.isVerified && user.role !== 'Lead Developer') {
      return res.status(401).json({ 
        success: false, 
        error: 'Account not verified. Please wait for Admin approval.' 
      });
    }

    // ... continue to check password ...

    // 3. Check if password matches (using the method we wrote in User Model)
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // 4. Send Token (The "Key")
    sendTokenResponse(user, 200, res);

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Helper function to generate JWT and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });

  // Security Option: We can also set this as a cookie here if needed later

  res.status(statusCode).json({
    success: true,
    token, // <--- This is the "Passport" the frontend needs
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

// @desc    Approve a user (Admin only)
// @route   PUT /api/auth/verify/:id
// @access  Private (Admin/Lead Dev)
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: `User ${user.name} has been approved.`
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};