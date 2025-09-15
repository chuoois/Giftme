const Users = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { env } = require('../configs/environment');

// Login controller
const login = async (req, res) => {
    const { email, pwd } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không đúng.' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(pwd, user.pwd);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không đúng.' });
        }

        // Tạo token
        const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
            expiresIn: env.ACCESS_TOKEN_EXPIRY,
        });

        res.status(200).json({
            message: 'Đăng nhập thành công',
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    login
};
