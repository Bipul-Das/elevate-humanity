// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { updateProfile, updatePassword, uploadProfilePhoto, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // It will save images to the 'server/uploads' folder
  },
  filename(req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Restrict to images only (2MB max)
const upload = multer({ 
  storage,
  limits: { fileSize: 2000000 }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Images only!'));
  }
});

router.use(protect); // Secure all routes

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
// NEW ROUTE: Note how we insert the `upload.single('image')` middleware
router.post('/upload-photo', upload.single('image'), uploadProfilePhoto);
router.get('/profile', getProfile); // <--- ADD THIS LINE

module.exports = router;