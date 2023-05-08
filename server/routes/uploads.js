// Route /uploads

const { Router } = require('express')
const expressFileUpload = require('express-fileupload')

const { fileUpload, returnImage } = require('../controllers/uploads')
const { verifyToken } = require('../middleware/autentication')

const router = Router()

router.use(expressFileUpload())

router.put('/api/upload/:type/:id', verifyToken, fileUpload)

router.get('/api/upload/:type/:user/:img', returnImage);

module.exports = router