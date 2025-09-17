const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../controllers/analytics.controller');

router.get('/', getAnalyticsData);

module.exports = router;