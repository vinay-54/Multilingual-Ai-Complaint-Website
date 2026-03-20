const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getUserComplaints
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

// User complaint routes
router.post('/', protect, createComplaint);
router.get('/', protect, getUserComplaints);

module.exports = router;
