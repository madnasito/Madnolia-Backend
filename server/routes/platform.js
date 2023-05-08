const express = require('express')
const { check } = require('express-validator')
const { getUserPlatforms, createPlatform, getPlatform } = require('../controllers/platform')
const { verifyToken } = require('../middleware/autentication')


const app = express()

app.post('/api/create_platform', createPlatform)

app.get('/api/user_platforms', verifyToken, getUserPlatforms)

app.get('/api/get_platform/:platform', getPlatform)

module.exports = app