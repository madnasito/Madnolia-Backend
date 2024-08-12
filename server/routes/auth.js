const express = require('express')
const { check } = require('express-validator')
const app = express()
const { login, createUser, renewToken, recoverPasswordToken } = require('../controllers/auth')
const { verifyToken } = require('../middleware/autentication')
const { validFields } = require('../middleware/valid_fields')

app.post('/api/login', [
    check('username', 'invalid_username').not().isEmpty(),
    check('password', "invalid_password").not().isEmpty(),
    validFields
], login)

// Post petition for create the user
app.post('/api/signin', [
    check('name', 'invalid_name').not().isEmpty().isString(),
    check('username', 'invalid_username').not().isEmpty().isString(),
    check('email', 'invalid_email').not().isEmpty().isEmail(),
    check('password', 'invalid_password').not().isEmpty().isString(),
    check('platforms', 'invalid_platforms').not().isEmpty().isArray(),
    validFields
], createUser)

app.post('/api/recover_password', [
    check('email', 'invalid_email').not().isEmpty().isEmail(),
    validFields
], recoverPasswordToken)

app.get('/api/renew',
    verifyToken,
    renewToken
)

module.exports = app