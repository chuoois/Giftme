const mongoose = require('mongoose');

const contentSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        img: { type: String, required: true },
        description: { type: String, required: true },
        tags: [{ type: String }],
        enable: { type: Boolean, default: false }, 
    },
    { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema, 'content');

module.exports = Content;
