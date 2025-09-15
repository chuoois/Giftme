const News = require("../models/news.model");
const mongoose = require("mongoose");

// 📌 Lấy danh sách (search, filter, sort, pagination)
const getArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category = "",
      sort = "desc", // "desc" = mới nhất, "asc" = cũ nhất
    } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const sortOption = { publishDate: sort === "asc" ? 1 : -1 };

    const articles = await News.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.json({
      data: articles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách bài viết" });
  }
};

// 📌 Lấy chi tiết theo ID
const getArticleById = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết bài viết" });
  }
};

// 📌 Tạo mới
const createArticle = async (req, res) => {
  try {
    const newArticle = new News(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo bài viết", error });
  }
};

// 📌 Cập nhật
const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật bài viết", error });
  }
};

// 📌 Xóa
const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await News.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.json({ message: "Xóa bài viết thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa bài viết" });
  }
};

const getSuggestedNews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID format",
      });
    }

    // Lấy bài viết hiện tại
    const currentNews = await News.findById(id);
    if (!currentNews) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // Tìm 3 bài khác cùng category
    const suggested = await News.find({
      _id: { $ne: id },
      category: currentNews.category,
    })
      .limit(3)
      .select("-__v");

    res.status(200).json({
      success: true,
      data: suggested,
      message: "Suggested news retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getSuggestedNews:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getSuggestedNews,
};
