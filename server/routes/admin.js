const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  updateComplaintStatus,
  getAdminStats,
  getAllUsers
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin functionality routes
router.get('/stats', protect, admin, getAdminStats);
router.get('/complaints', protect, admin, getAllComplaints);
router.put('/complaints/:id', protect, admin, updateComplaintStatus);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
