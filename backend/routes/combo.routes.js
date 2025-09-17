const express = require('express');
const router = express.Router();
const { getComboList, addCombo, deleteCombo, editCombo, getComboById, getHotCombos, getSuggestedCombos, suggestGifts} = require("../controllers/combo.controller");
const { authenticateToken } = require("../middleware/auth.middeware");

router.get('/', getComboList);
router.post('/', authenticateToken, addCombo);
router.delete('/:id', authenticateToken, deleteCombo);
router.get('/hot', getHotCombos);
router.put('/:id', authenticateToken, editCombo);
router.get('/:id', getComboById);
router.get('/suggested/:id', getSuggestedCombos);
router.get('/suggest-gifts', suggestGifts);

module.exports = router;