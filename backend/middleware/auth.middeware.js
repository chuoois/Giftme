const jwt = require('jsonwebtoken');
const { env } = require('../configs/environment');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access token required'
        });
    }

    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid or expired token'
            });
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = { authenticateToken };