const express = require('express')
const app = express()
const { verifyToken } = require('../middleware/autentication')
const { createMatch, getMatch, editMatch, deleteMatch, playerMatches, matchesByPlatform, matchesByGame, platformGameMatches } = require('../controllers/match')

// Route for only get one match
app.get("/match/:id", getMatch)

// Route for the player's matches
app.get('/player_matches', verifyToken, playerMatches)

// // Route for get matches by platform
// app.get('/matches_of/:platform', matchesByPlatform)

// Route for get matches by game and platform
app.get('/matches_of_game/:platform/:game', platformGameMatches)
    // Route for get matches by game
app.get('/game_matches/:game', matchesByGame)

// Route for create a match
app.post('/match', verifyToken, createMatch)

// Route for edit a match
app.put('/edit_match', verifyToken, editMatch)

// Route for delete a match
app.delete('/delete_match/:id', verifyToken, deleteMatch)

module.exports = app