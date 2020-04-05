const express = require('express')

const DeclarationControl = require('../controllers/declarationController')
const FolderControl = require('../controllers/folderController')
const EmployerControl = require('../controllers/employerController')
const UserControl = require('../controllers/userController')

const router = express.Router()

router.get('/declarations/:folder', DeclarationControl.getDeclarations)
router.post('/declaration', DeclarationControl.createDeclaration)
router.delete('/declaration/:id', DeclarationControl.deleteDeclaration)
router.get('/declaration/:id', DeclarationControl.getDeclarationById)
router.post('/folder', FolderControl.createFolder)
router.post('/user', UserControl.createUser)
router.post('/employer', EmployerControl.createEmployer)
router.get('/employer', EmployerControl.getEmployers)
router.get('/folder', FolderControl.getFolderActive)

module.exports = router