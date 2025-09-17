const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const comboRoutes = require('./combo.routes');
const newsRoutes = require('./news.routes');
const contentRoutes = require('./content.routes');
const analyticsRoutes = require('./analytics.routes');
const botRoutes = require('./bot.routes');

router.use('/content', contentRoutes);
router.use('/auth', authRoutes);
router.use('/combos', comboRoutes);
router.use('/news', newsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/bot', botRoutes);

module.exports = router;