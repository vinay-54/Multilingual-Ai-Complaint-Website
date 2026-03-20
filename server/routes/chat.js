const express = require('express');
const router = express.Router();
const { processChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/message', protect, processChat);

module.exports = router;
