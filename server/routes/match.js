const express = require('express')
const app = express()
const { check } = require('express-validator')
const { verifyToken } = require('../middleware/autentication')
const { createMatch, getMatch, editMatch, deleteMatch, playerMatches, platformGameMatches } = require('../controllers/match')
const { getGamesByPlatforms } = require('../controllers/game')
const { validFields } = require('../middleware/valid_fields')

// Route for only get one match
app.get("/api/match/:id", getMatch)

// Route for the player's matches
app.get('/api/player_matches', verifyToken, playerMatches)

// Route for get matches by platform
app.get('/api/matches_of/:platform', getGamesByPlatforms)

// Route for get matches by game and platform
app.get('/api/matches_of_game/:platform/:game', platformGameMatches)

// Route for create a match
app.post('/api/match', [
    check('game_id', 'invalid_game_id').not().isEmpty().isInt(),
    check('platform', 'invalid_platform').not().isEmpty().isInt(),
    check('users', 'invalid_users').isArray(),
    validFields,
    verifyToken
], createMatch)

// Route for edit a match
app.put('/api/edit_match', verifyToken, editMatch)

// Route for delete a match
app.delete('/api/delete_match/:id', verifyToken, deleteMatch)

module.exports = app