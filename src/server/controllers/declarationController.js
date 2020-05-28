const DeclarationModel = require("../../model/declaration-model");

const createDeclaration = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a declaration",
    });
  }

  const declaration = new DeclarationModel(body);

  if (!declaration) {
    return res.status(400).json({ success: false, error: res });
  }

  declaration
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        declaration: declaration,
        message: "declaration created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "declaration not created!",
      });
    });
};

const getDeclarations = async (req, res) => {
  await DeclarationModel.find(
    { folder: req.params.folder },
    (err, declaration) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!declaration || declaration.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: `Declarations not found` });
      }
      return res.status(200).json({ success: true, data: declaration });
    }
  ).catch((err) => console.log(err));
};

const deleteDeclaration = async (req, res) => {
  await DeclarationModel.findOneAndDelete(
    { _id: req.params.id },
    (err, declaration) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      if (!declaration) {
        return res
          .status(404)
          .json({ success: false, error: `declaration not found` });
      }

      return res.status(200).json({ success: true, data: declaration });
    }
  ).catch((err) => console.log(err));
};

const getDeclarationById = async (req, res) => {
  await DeclarationModel.findOne({ _id: req.params.id }, (err, declaration) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!declaration) {
      return res
        .status(404)
        .json({ success: false, error: `declaration not found` });
    }
    return res.status(200).json({ success: true, data: declaration });
  }).catch((err) => console.log(err));
};

const updateDeclaration = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  DeclarationModel.findOne({ _id: req.params.id }, (err, declaration) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Declaration not found!",
      });
    }
    declaration.annexe = body.annexe;
    declaration.dateStart = body.dateStart;
    declaration.dateEnd = body.dateEnd;
    declaration.employer = body.employer;
    declaration.label = body.label;
    declaration.nbhours = body.nbhours;
    declaration.netSalary = body.netSalary;
    declaration.grossSalary = body.grossSalary;
    declaration
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: declaration._id,
          message: "Declaration updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Declaration not updated!",
        });
      });
  });
};

module.exports = {
  getDeclarations,
  createDeclaration,
  getDeclarationById,
  deleteDeclaration,
  updateDeclaration,
};
