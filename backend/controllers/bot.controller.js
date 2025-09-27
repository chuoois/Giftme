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

async function analyzeGiftRequest(userInput) {
  const prompt = `
  Người dùng viết: "${userInput}".

  Hãy phân tích và trả về JSON với cấu trúc:
  {
    "occasion": "dịp tặng quà (ví dụ: sinh nhật, noel, valentine...), null nếu không có",
    "budgetMin": số tiền tối thiểu (nghìn VND, null nếu không có),
    "budgetMax": số tiền tối đa (nghìn VND, null nếu không có),
    "features": ["công nghệ", "thời trang", "làm đẹp", ...] hoặc []
  }

  Trả về **chỉ JSON hợp lệ**, không thêm chữ nào khác.
  `;

  try {
    const result = await askGemini(prompt);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Lỗi phân tích Gemini:", err);
  }

  return { occasion: null, budgetMin: null, budgetMax: null, features: [] };
}

const getBotResponse = async (req, res) => {
  try {
    const userInput = req.body.userInput;
    if (!userInput || typeof userInput !== "string") {
      return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ." });
    }

    // Step 1: Xác định intent
    let intent = "other";
    try {
      const intentRaw = await askGemini(`
        Người dùng viết: "${userInput}".
        Hãy trả về JSON: { "intent": "greeting" | "gift_request" | "other" }
      `);
      intent = JSON.parse(intentRaw).intent || "other";
    } catch {
      intent = "other";
    }

    // Step 2: Xử lý theo intent
    if (intent === "greeting") {
      const reply = await askGemini(`
        Người dùng: "${userInput}".
        Bạn là chatbot tư vấn quà tặng, nhưng hãy trả lời xã giao thân thiện.
      `);
      return res.json({ response: reply, data: [] });
    }

    if (intent === "gift_request") {
      const analysis = await analyzeGiftRequest(userInput);

      // Tạo query DB
      let query = {};
      if (analysis.occasion) query.occasion = analysis.occasion.toLowerCase();
      if (analysis.budgetMin || analysis.budgetMax) {
        query.price = {};
        if (analysis.budgetMin) query.price.$gte = analysis.budgetMin;
        if (analysis.budgetMax) query.price.$lte = analysis.budgetMax;
      }
      if (analysis.features?.length > 0) {
        query.features = { $in: analysis.features.map(f => f.toLowerCase()) };
      }

      const suggestions = await Combos.find(query).limit(5);

      if (suggestions.length > 0) {
        return res.json({
          response: "Mình tìm được một vài gợi ý quà phù hợp với yêu cầu của bạn:",
          data: suggestions
        });
      }

      const fallback = await askGemini(`
        Người dùng hỏi: "${userInput}".
        Bạn là chatbot tư vấn quà tặng. Hãy trả lời thân thiện, lịch sự, và đưa ra lời khuyên chung.
      `);
      return res.json({ response: fallback, data: [] });
    }

    // Default cho intent = other
    const reply = await askGemini(`
      Người dùng: "${userInput}".
      Bạn là chatbot tư vấn quà tặng. Hãy trả lời lịch sự, nhưng giải thích là bạn chỉ chuyên về tư vấn quà.
    `);
    return res.json({ response: reply, data: [] });

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