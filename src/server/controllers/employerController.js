const EmployerModel = require('../../model/employer-model')

const createEmployer = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an employer',
        })
    }

    const employer = new EmployerModel(body)

    if (!employer) {
        return res.status(400).json({ success: false, error: res })
    }

    employer
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: employer._id,
                message: 'employer created!',
            })
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: 'employer not created!',
            })
        })
}

const getEmployers = async (req, res) => {
    await EmployerModel.find({ }, (err, employer) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!employer) {
            return res
                .status(404)
                .json({ success: false, error: `Employer not found` })
        }
        return res.status(200).json({ success: true, data: employer })
    }).catch((err) => console.log(err))
}

module.exports = {
    getEmployers,
    createEmployer
}