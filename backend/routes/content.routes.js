const express = require("express");
const {
  createContent,
  getContents,
  updateContent,
  deleteContent,
  getEnabledContent,
} = require("../controllers/content.controller");
const { authenticateToken } = require("../middleware/auth.middeware");

const router = express.Router();

router.post("/", authenticateToken, createContent);
router.get("/", getContents);
router.get("/enabled", getEnabledContent);  
router.put("/:id", authenticateToken, updateContent);
router.delete("/:id", authenticateToken, deleteContent);

module.exports = router;
