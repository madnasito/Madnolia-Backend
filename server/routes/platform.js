const express = require('express')
const { check } = require('express-validator')
const { getUserPlatforms, createPlatform, getPlatform } = require('../controllers/platform')
const { verifyToken } = require('../middleware/autentication')


const app = express()

app.post('/create_platform', createPlatform)

app.get('/user_platforms', verifyToken, getUserPlatforms)

app.get('/get_platform/:platform', getPlatform)

module.exports = app