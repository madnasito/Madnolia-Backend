<<<<<<< HEAD
const express = require('express')
const app = express()
const { verifyToken } = require('../middleware/autentication')
const { createMatch, getMatch, editMatch, deleteMatch, playerMatches, platformGameMatches } = require('../controllers/match')
const { getGamesByPlatforms } = require('../controllers/game')

// Route for only get one match
app.get("/api/match/:id", getMatch)

// Route for the player's matches
app.get('/api/player_matches', verifyToken, playerMatches)

// Route for get matches by platform
app.get('/api/matches_of/:platform', getGamesByPlatforms)

// Route for get matches by game and platform
app.get('/api/matches_of_game/:platform/:game', platformGameMatches)

// Route for create a match
app.post('/api/match', verifyToken, createMatch)

// Route for edit a match
app.put('/api/edit_match', verifyToken, editMatch)

// Route for delete a match
app.delete('/api/delete_match/:id', verifyToken, deleteMatch)

=======
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

>>>>>>> 3f575ba2f65495761cb8fbe59ed74702355a3a32
module.exports = app