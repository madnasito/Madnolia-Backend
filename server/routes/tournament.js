const express = require('express')
const { createTournament, createTournamentMatches, addPlayerToMatch, deletePlayer, addWinner } = require('../controllers/tournament');
const { verifyToken } = require('../middleware/autentication');
const app = express()

// Create tournament
app.post("/api/tournament", verifyToken, createTournament);

// Create next match for tournament
app.post("/api/new_tournament_match", verifyToken, createTournamentMatches);

app.post("/api/tournament/add_player", verifyToken, addPlayerToMatch)

app.post("/api/tournament/delete_player", verifyToken, deletePlayer)

app.post("/api/tournament/add_winner", verifyToken, addWinner)

module.exports = app