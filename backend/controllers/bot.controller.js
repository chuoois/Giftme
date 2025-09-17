const Bot = require('../models/bot.model');

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


const getBotResponse = async (userInput) => {
    if (typeof userInput !== "string") {
        return "Xin lỗi, dữ liệu đầu vào không hợp lệ.";
    }

    const input = userInput.toLowerCase();

    const responses = await Bot.find({ isActive: true });
    for (let item of responses) {
        for (let keyword of item.keywords) {
            if (input.includes(keyword.toLowerCase())) {
                return item.response;
            }
        }
    }

    return "Xin lỗi, tôi chưa hiểu. Bạn có thể hỏi câu khác được không?";
};


module.exports = {
    createMessageBot,
    deleteMessageBot,
    getAllMessageBots,
    getBotResponse,
    updateMessageBot
}