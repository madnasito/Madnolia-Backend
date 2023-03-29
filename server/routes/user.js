const express = require('express')
const app = express()
const { createUser, getUserInfo, updateUser, verifyUser, updatePlatforms, searchUser, getPartners, addPartner, recoverPassword, getUserInvitations, resetNotifications } = require('../controllers/user')
const { verifyToken, verifyPasswordToken } = require('../middleware/autentication')
const { check } = require('express-validator')
const { validFields } = require('../middleware/valid_fields')

// Post petition for create the user
app.post('/api/signin', [
    check('name', 'The name is required').not().isEmpty(),
    check('username', 'The username is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('password', 'The password is required').not().isEmpty(),
    check('platforms', 'Select at least one platform').not().isEmpty(),
    validFields
], createUser)

// Post petition for verify user
app.post('/api/verify_user/:username/:email', verifyUser)

// GET petition for search user by username
app.get('/api/search_user/:username', searchUser)

// GET petition for search user by username
app.get('/api/get_partners', verifyToken, getPartners)

// GET petition for get the user info by token
app.get('/api/user_info', verifyToken, getUserInfo)

// Get user match's invitations
app.get('/api/invitations', verifyToken, getUserInvitations)

// Reset notifications
app.get('/api/reset_notifications', verifyToken, resetNotifications)

// Recovering password for user
app.get('/api/recover_password/:token', [
    check('password', 'Please send the password').not().isEmpty(),
    validFields,
    verifyPasswordToken
], recoverPassword)

// Add a partner for the user
app.post("/api/add_partner", [
    check('partner', 'The user is required').not().isEmpty(),
    validFields,
    verifyToken
], addPartner)

// Update user
app.put('/api/update_user', verifyToken, updateUser)

app.put('/api/update_user_platforms', [check('platforms', 'The platforms are empty').not().isEmpty(), validFields],
    verifyToken,
    updatePlatforms
)


module.exports = app