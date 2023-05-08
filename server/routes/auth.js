const express = require('express')
const { check } = require('express-validator')
const app = express()
const { login, renewToken, recoverPasswordToken } = require('../controllers/auth')
const { verifyToken } = require('../middleware/autentication')
const { validFields } = require('../middleware/valid_fields')

app.post('/api/login', [
    check('username', 'The username is required').not().isEmpty(),
    check('password', "The password is required").not().isEmpty(),
    validFields
], login)

app.post('/api/recover_password', [
    check('email', 'Need email for recover password').not().isEmpty(),
    validFields
], recoverPasswordToken)

app.get('/api/renew',
    verifyToken,
    renewToken
)

module.exports = app