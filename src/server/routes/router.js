const express = require("express");

const DeclarationControl = require("../controllers/declarationController");
const FolderControl = require("../controllers/folderController");
const FileControl = require("../controllers/fileController");
const EmployerControl = require("../controllers/employerController");

const router = express.Router();

router.get("/declarations/:folder", DeclarationControl.getDeclarations);
router.post("/declaration", DeclarationControl.createDeclaration);
router.delete("/declaration/:id", DeclarationControl.deleteDeclaration);
router.get("/declaration/:id", DeclarationControl.getDeclarationById);
router.post("/folder", FolderControl.createFolder);
router.post("/employer", EmployerControl.createEmployer);
router.get("/employer", EmployerControl.getEmployers);
router.get("/folder/:user", FolderControl.getFolderActive);
router.get("/folders/:user", FolderControl.getFoldersInactive);
router.put("/declaration/:id", DeclarationControl.updateDeclaration);
router.put("/folder/:id", FolderControl.updateFolder);
router.get("/file/:declaration", FileControl.getFile);
router.post("/file", FileControl.addFile);

module.exports = router;
