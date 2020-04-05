const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Declaration = new Schema(
    {
        annexe: { type: String, required: true },
        dateStart: { type: Date, required: true },
        dateEnd: { type: Date, required: false },
        employer: { type: String, required: true },
        label: { type: String, required: false },
        nbhours: { type: Number, required: true },
        netSalary: { type: Number, required: true },
        grossSalary: { type: Number, required: true },
        workContract: { type: String, required: false },
        payCheck: { type: String, required: false },
        aem: { type: String, required: false },
        vacationPay: { type: String, required: false },
        guso: { type: String, required: false },
        folder: {type: Schema.Types.ObjectId, ref: 'Folder'}
    },
    { timestamps: true },
)
module.exports = mongoose.model('declaration', Declaration)