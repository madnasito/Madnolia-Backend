<<<<<<< HEAD
const express = require('express')
const { check } = require('express-validator')
const { getUserPlatforms, createPlatform, getPlatform } = require('../controllers/platform')
const { verifyToken } = require('../middleware/autentication')


const app = express()

app.post('/api/create_platform', createPlatform)

app.get('/api/user_platforms', verifyToken, getUserPlatforms)

app.get('/api/get_platform/:platform', getPlatform)

=======
const express = require('express')
const { check } = require('express-validator')
const { getUserPlatforms, createPlatform, getPlatform } = require('../controllers/platform')
const { verifyToken } = require('../middleware/autentication')


const app = express()

app.post('/create_platform', createPlatform)

app.get('/user_platforms', verifyToken, getUserPlatforms)

app.get('/get_platform/:platform', getPlatform)

>>>>>>> 3f575ba2f65495761cb8fbe59ed74702355a3a32
module.exports = app