const FileModel = require("../../model/file-model");

const addFile = (req, res) => {
  const body = req.body;

  var newFile = new FileModel(body);

  newFile
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: "file created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "file not created!",
      });
    });
};

const getFile = async (req, res) => {
  await FileModel.find({ declaration: req.params.declaration }, (err, file) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!file || file.length === 0) {
      return res.status(404).json({ success: false, error: `File not found` });
    }

    return res.status(200).json({ success: true, file });
  });
};

module.exports = {
  getFile,
  addFile,
};
