const express = require('express')
const { check } = require('express-validator')
const app = express()
const { login, createUser, renewToken, recoverPasswordToken } = require('../controllers/auth')
const { verifyToken } = require('../middleware/autentication')
const { validFields } = require('../middleware/valid_fields')

app.post('/api/login', [
    check('username', 'The username is required').not().isEmpty(),
    check('password', "The password is required").not().isEmpty(),
    validFields
], login)

// Post petition for create the user
app.post('/api/signin', [
    check('name', 'The name is required').not().isEmpty(),
    check('username', 'The username is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('password', 'The password is required').not().isEmpty(),
    check('platforms', 'Select at least one platform').not().isEmpty(),
    validFields
], createUser)

app.post('/api/recover_password', [
    check('email', 'Need email for recover password').not().isEmpty(),
    validFields
], recoverPasswordToken)

app.get('/api/renew',
    verifyToken,
    renewToken
)

module.exports = app