const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  logoutUser,
  updateProfilePicture,
  adminLogin
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Auth routes matching user specifications
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);
router.put('/profile/picture', protect, updateProfilePicture);

module.exports = router;
