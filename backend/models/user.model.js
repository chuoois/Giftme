const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        pwd: { type: String },
        role: {
            type: String,
            enum: ['user', 'admin']
        }
    },
    { timestamps: true }
);

const Users = mongoose.model('Users', userSchema, 'users');

module.exports = Users;