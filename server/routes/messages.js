const express = require('express')
const app = express()
const { verifyToken } = require('../middleware/autentication')
const { check } = require('express-validator')
const { validFields } = require('../middleware/valid_fields')
const { getMatchMessages } = require('../controllers/http/messages/match_message')

// Get messages from match

app.get("/api/match-messages", [
    check("match", "Please set the match").not().isEmpty(),
    validFields,
    verifyToken], getMatchMessages);

module.exports = app