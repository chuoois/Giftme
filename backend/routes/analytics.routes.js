const express = require('express');
const router = express.Router();
const { getAnalyticsData, clearCache } = require('../controllers/analytics.controller');

router.get('/', getAnalyticsData);
router.get('/clear-cache', clearCache);

module.exports = router;