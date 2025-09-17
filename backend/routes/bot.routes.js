const express = require('express');
const router = express.Router();
const { createMessageBot, deleteMessageBot, getAllMessageBots, getBotResponse, updateMessageBot } = require('../controllers/bot.controller');
const { authenticateToken } = require("../middleware/auth.middeware");

router.post('/', authenticateToken, createMessageBot);
router.get('/', getAllMessageBots);
router.post('/response', getBotResponse);
router.put('/:id', authenticateToken, updateMessageBot);
router.delete('/:id', authenticateToken, deleteMessageBot);

module.exports = router;