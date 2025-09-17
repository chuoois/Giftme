const Bot = require('../models/bot.model');
const Combos = require('../models/combo.model');

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


// Hàm chuyển tiếng Việt có dấu sang không dấu
function removeVietnameseTones(str) {
    str = str.toLowerCase();
    str = str.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a");
    str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e");
    str = str.replace(/i|í|ì|ỉ|ĩ|ị/g, "i");
    str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o");
    str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u");
    str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // dấu
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ký tự phụ
    return str;
}


const getBotResponse = async (req, res) => {
    try {
        const userInput = req.body.userInput;
        if (!userInput || typeof userInput !== "string") {
            return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ." });
        }

        const input = userInput.toLowerCase();

        // 1. Kiểm tra nếu user hỏi về quà / sản phẩm
        const giftKeywords = ["quà tặng", "món quà", "gợi ý quà", "sản phẩm"];
        if (giftKeywords.some(k => input.includes(k))) {

            // --- Phân tích câu ---
            // Dịp
            let occasion = null;
            const occasions = ["valentine", "8/3", "20/10", "noel", "sinh nhật", "tết nguyên đán"].map(removeVietnameseTones);
            for (let o of occasions) {
                if (input.includes(o)) {
                    occasion = o;
                    break;
                }
            }

            // Ngân sách
            let budgetMin = null;
            let budgetMax = null;
            const budgetMatch = input.match(/(\d+)\s*(nghìn|triệu)/g);
            if (budgetMatch) {
                // Chuyển sang số thực tế
                const budgets = budgetMatch.map(b => {
                    let num = parseInt(b.match(/\d+/)[0]);
                    if (b.includes("triệu")) num *= 1000;
                    return num;
                });
                if (budgets.length === 1) budgetMax = budgets[0];
                else if (budgets.length >= 2) {
                    budgetMin = budgets[0];
                    budgetMax = budgets[1];
                }
            }

            // Tính năng / loại quà
            let features = [];
            const featureKeywords = ["công nghệ", "thời trang", "làm đẹp", "đồ chơi"].map(removeVietnameseTones);
            features = featureKeywords.filter(f => input.includes(f));

            // --- Query database ---
            let query = {};
            if (occasion) query.occasion = occasion;
            if (budgetMin || budgetMax) {
                query.price = {};
                if (budgetMin) query.price.$gte = budgetMin;
                if (budgetMax) query.price.$lte = budgetMax;
            }
            if (features.length > 0) {
                query.features = { $in: features };
            }

            const suggestions = await Combos.find(query).limit(5);

            if (suggestions.length > 0) {
                return res.json({ response: "Mình gợi ý cho bạn những món quà sau:", data: suggestions });
            } else {
                return res.json({ response: "Xin lỗi, hiện mình chưa tìm thấy sản phẩm phù hợp." });
            }
        }

        // 2. Keyword match bình thường
        const responses = await Bot.find({ isActive: true });
        for (let item of responses) {
            for (let keyword of item.keywords) {
                if (input.includes(keyword.toLowerCase())) {
                    return res.json({ response: item.response });
                }
            }
        }

        return res.json({ response: "Xin lỗi, tôi chưa hiểu. Bạn có thể hỏi câu khác được không?" });
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