const User = require('../../model/user-model')

const createUser = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an user',
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({ success: false, error: res })
    }

    user
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'user created!',
            })
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: 'user not created!',
            })
        })
}

module.exports = {
    createUser
}
