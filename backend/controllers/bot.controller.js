const Bot = require('../models/bot.model');
const Combos = require('../models/combo.model');
const askGemini = require("../utils/gemini");
const analyzeUserInput = require("../utils/analyzeInput");

// Tạo bot mới
const createMessageBot = async (req, res) => {
  try {
    const { keywords, response } = req.body;

    if (!keywords || !response) {
      return res.status(400).json({ message: "Keywords và response là bắt buộc." });
    }

    const newBot = new Bot({
      keywords,
      response
    });

    const savedBot = await newBot.save();
    res.status(201).json(savedBot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách tất cả bot
const getAllMessageBots = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {
      $or: [
        { keywords: { $regex: search, $options: "i" } },
        { response: { $regex: search, $options: "i" } }
      ]
    };

    const bots = await Bot.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Bot.countDocuments(query);

    res.status(200).json({
      data: bots,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật bot theo ID
const updateMessageBot = async (req, res) => {
  try {
    const { keywords, response, isActive } = req.body;
    const updatedBot = await Bot.findByIdAndUpdate(
      req.params.id,
      { keywords, response, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedBot) return res.status(404).json({ message: "Bot không tồn tại." });
    res.status(200).json(updatedBot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bot theo ID
const deleteMessageBot = async (req, res) => {
  try {
    const deletedBot = await Bot.findByIdAndDelete(req.params.id);
    if (!deletedBot) return res.status(404).json({ message: "Bot không tồn tại." });
    res.status(200).json({ message: "Bot đã được xóa thành công." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBotResponse = async (req, res) => {
  try {
    const userInput = req.body.userInput;
    if (!userInput || typeof userInput !== "string") {
      return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ." });
    }

    // 1. Phân tích input bằng AI
    const analysis = await analyzeUserInput(userInput);

    let query = {};
    
    // 🔹 Fix lọc occasion chính xác
    if (analysis.occasion) {
      query.occasion = { $regex: `^${analysis.occasion}$`, $options: "i" };
    }


    if (analysis.budgetMin || analysis.budgetMax) {
      query.price = {};
      if (analysis.budgetMin) query.price.$gte = analysis.budgetMin;
      if (analysis.budgetMax) query.price.$lte = analysis.budgetMax;
    }

    if (analysis.features && analysis.features.length > 0) {
      query.features = { $in: analysis.features.map(f => f.toLowerCase()) };
    }

    // 2. Query sản phẩm
    const suggestions = await Combos.find(query).limit(5);

    if (suggestions.length > 0) {
      return res.json({
        response: `Mình tìm được một vài gợi ý quà phù hợp với yêu cầu của bạn:`,
        data: suggestions
      });
    } else {
      // 3. Nếu không có sản phẩm thì fallback sang chat AI
      const aiText = await askGemini(`
        Người dùng hỏi: "${userInput}".
        Bạn là chatbot tư vấn quà tặng. Hãy trả lời thân thiện, lịch sự, và đưa ra lời khuyên chung.
      `);
      return res.json({ response: aiText, data: [] });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};



module.exports = {
  createMessageBot,
  deleteMessageBot,
  getAllMessageBots,
  getBotResponse,
  updateMessageBot
}