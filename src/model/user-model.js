const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        lastname: { type: String, required: false },
        firstname: { type: String, required: true },
        login: { type: String, required: false },
        password: { type: String, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('user', User)