const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Employer = new Schema(
    {
        name: { type: String, required: true },
    }
)

module.exports = mongoose.model('employer', Employer)