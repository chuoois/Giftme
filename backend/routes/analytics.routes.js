const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../controllers/analytics.controller');
const { authenticateToken } = require("../middleware/auth.middeware");

router.get('/', authenticateToken, getAnalyticsData);

module.exports = router;