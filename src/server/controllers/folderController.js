const FolderModel = require('../../model/folder-model')

const createFolder = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a folder',
        })
    }

    const folder = new FolderModel(body)

    if (!folder) {
        return res.status(400).json({ success: false, error: res })
    }

    folder.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: folder._id,
                message: 'folder created!',
            })
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: 'folder not created!',
            })
        })
}

const getFolderActive = async (req,res ) => {
    await FolderModel.findOne({ "active": true  }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `Folder not found` })
        }
        return res.status(200).json({ success: true, data })
    }).catch((err) => console.log(err))
}

module.exports = {
    createFolder,
    getFolderActive
}
