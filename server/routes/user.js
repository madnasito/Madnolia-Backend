const express = require('express')
const app = express()
const { createUser, getUserInfo, updateUser, verifyUser, updatePlatforms, searchUser, getPartners, addPartner, recoverPassword } = require('../controllers/user')
const { verifyToken, verifyPasswordToken } = require('../middleware/autentication')
const { check } = require('express-validator')
const { validFields } = require('../middleware/valid_fields')

// Post petition for create the user
app.post('/signin', [
    check('name', 'The name is required').not().isEmpty(),
    check('username', 'The username is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('password', 'The password is required').not().isEmpty(),
    check('platforms', 'Select at least one platform').not().isEmpty(),
    validFields
], createUser)

// Post petition for verify user
app.post('/verify_user/:username/:email', verifyUser)

// GET petition for search user by username
app.get('/search_user/:username', searchUser)
    // GET petition for search user by username
app.get('/get_partners', verifyToken, getPartners)
    // GET petition for get the user info by token
app.get('/user_info', verifyToken, getUserInfo)

// Recovering password for user
app.get('/recover_password/:token', [
    check('password', 'Please send the password').not().isEmpty(),
    validFields,
    verifyPasswordToken
], recoverPassword)

// Add a partner for the user
app.post("/add_partner", [
    check('partner', 'The user is required').not().isEmpty(),
    validFields,
    verifyToken
], addPartner)

app.put('/update_user', verifyToken, updateUser)

app.put('/update_user_platforms', [check('platforms', 'The platforms are empty').not().isEmpty(), validFields],
    verifyToken,
    updatePlatforms
)


module.exports = app