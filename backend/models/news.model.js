const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        excerpt: { type: String, required: true },
        content: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        author: { type: String, required: true },
        publishDate: { type: Date, required: true },
        readTime: { type: Number, required: true },
        featured: { type: Boolean, default: false },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

const News = mongoose.model('News', newsSchema, 'news');

module.exports = News;