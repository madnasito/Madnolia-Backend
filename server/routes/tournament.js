const express = require('express')
const { createTournament, createTournamentMatches, addPlayerToMatch, deletePlayer, addWinner } = require('../controllers/tournament');
const { verifyToken } = require('../middleware/autentication');
const { check } = require('express-validator');
const { validFields } = require('../middleware/valid_fields');
const app = express()

// Create tournament
app.post("/api/new-tournament", [ 
    check("type", "invalid_players").not().isEmpty().isInt(),
    check("platform", "invalid_platform").not().isEmpty().isInt(),
    check("date", "invalid_date").not().isEmpty(),
    check("game_id", "invalid_game").not().isEmpty().isInt(),
    validFields,
    verifyToken
], createTournament);

// Create next match for tournament
app.post("/api/new-tournament-match", verifyToken, createTournamentMatches);

app.post("/api/tournament/add-player", verifyToken, addPlayerToMatch)

app.post("/api/tournament/delete-player", verifyToken, deletePlayer)

app.post("/api/tournament/add-winner", verifyToken, addWinner)

module.exports = app