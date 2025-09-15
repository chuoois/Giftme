const mongoose = require('mongoose');

const comboSchema = mongoose.Schema({
    name: { type: String, required: true }, // Tên combo
    price: { type: Number, required: true }, // Giá sau giảm
    originalPrice: { type: Number, required: true }, // Giá gốc
    image: { type: String, required: true }, // Ảnh chính
    badge: { type: String, enum: ["HOT", "NEW", "SALE", "LIMITED"], default: null }, // Nhãn
    discount: { type: Number, default: 0 }, // % giảm
    category: { type: String, required: true }, // Danh mục
    occasion: { type: String, required: true }, // Dịp (Valentine, Tết, Noel...)
    priceRange: { type: String }, // Phân khúc giá
    description: { type: String }, // Mô tả

    features: [{ type: String }], // Điểm nổi bật
    includes: [{ type: String }], // Thành phần trong combo

    gallery: [{ type: String }], // Nhiều ảnh
}, { timestamps: true });

const Combos = mongoose.model('Combos', comboSchema, 'combos');

module.exports = Combos;