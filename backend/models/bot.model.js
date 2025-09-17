
const mongoose = require('mongoose');

const botResponseSchema = mongoose.Schema({
    keywords: {
        type: [String],  // danh sách từ khóa
        required: true
    },
    response: {
        type: String,    // câu trả lời của bot
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Bot = mongoose.model('Bot', botResponseSchema, 'bot');

module.exports = Bot;
