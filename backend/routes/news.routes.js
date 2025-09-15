const express = require("express");
const router = express.Router();
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getSuggestedNews
} = require("../controllers/news.controller");
const { authenticateToken } = require("../middleware/auth.middeware");

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", authenticateToken, createArticle);
router.put("/:id", authenticateToken, updateArticle);
router.delete("/:id", authenticateToken, deleteArticle);
router.get("/suggested/:id", getSuggestedNews);

module.exports = router;