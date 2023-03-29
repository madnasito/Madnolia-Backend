<<<<<<< HEAD
// Route /uploads

const { Router } = require('express')
const expressFileUpload = require('express-fileupload')

const { fileUpload, returnImage } = require('../controllers/uploads')
const { verifyToken } = require('../middleware/autentication')

const router = Router()

router.use(expressFileUpload())

router.put('/api/upload/:type/:id', verifyToken, fileUpload)

router.get('/api/upload/:type/:user/:img', returnImage);

=======
// Route /uploads

const { Router } = require('express')
const expressFileUpload = require('express-fileupload')

const { fileUpload, returnImage } = require('../controllers/uploads')
const { verifyToken } = require('../middleware/autentication')

const router = Router()

router.use(expressFileUpload())

router.put('/upload/:type/:id', verifyToken, fileUpload)

router.get('/upload/:type/:user/:img', returnImage);

>>>>>>> 3f575ba2f65495761cb8fbe59ed74702355a3a32
module.exports = router