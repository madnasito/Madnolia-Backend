/* TO DO: Create a wai to create a tournament that tournament will be a matches's collection
The player will create a tournament for x game, selecting the game, and creating any number of matches
Those matches only can be edited by the hoster, and hoster can create any number of matches later on the tournament
only for the players who won .*/

const Match = require("../models/match");
const Tournament = require("../models/tournament");
const { createGame, addGameMatch } = require("./game");
const Game = require('../models/game')
const User = require('../models/user')


const createTournament = async (req, res) =>{
    
    let matches = []
    let body = req.body;

    const validTypes = [4, 8, 16, 32, 64]
    
    let type = 4
    if(body.type){
        type = Number(body.type);
    }

    if( ! validTypes.includes(type)){
        return res.json({
            ok: false,
            message: "The number of players is not valid"
        });
    }


    for (let index = 1; index <= type / 2; index++) {
        const name = `${req.body.name} (${index})`
        const match = await createMatch(req, name);
        if(match){
            matches.push({
                match: match._id
        })
        }else{
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Error creating the match"
                }
            })
        }
    }

    const tournament = new Tournament({
        name: body.name,
        game_id: body.game_id,
        platform: body.platform,
        date: body.date,
        user: req.user,
        type: type,
        matches
    })

    tournament.save((err, tournamentDB) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            tournamentDB
        })

    })
    
}


// Creating a Match
const createMatch = async (req, name) => {

    const body = req.body

    const match = new Match({
        game_name: body.game_name,
        game_id: body.game_id,
        platform: body.platform,
        date: body.date,
        user: req.user,
        name,
        img: body.img,
        users: body.users,
        tournament_match: body.tournament
    })


    const game = await Game.findOne({ game_id: body.game_id })


    if (game) {
        addGameMatch(req)
    }
    if (!game) {
        game = await createGame(req)
    }

    let matchDB = await match.save(match);

    await User.updateMany({ _id: { $in: body.users } }, { $push: { 'invitations': matchDB._id }, $inc: { notifications: 1 } }, (err) => {
        if (err) {
            return false
            }
        }
    )        

    return matchDB;
}

const createTournamentMatches = async(req, res) =>{

    let body = req.body


    /* TO DO: Verificar que cada una de las partidas esten llenas, no tengan conflictos y cada una de ellas
    tenga su ganador. Luego de hacer eso, se los jugadores ganadores pasaran a la siguiente ronda de partidas
    */


    const tournament = await Tournament.findById(body.tournament_id);

    if(! tournament){
        return res.status(404).json({
            ok: false,
            message: "Error in tournament"
        })
    }

    if(tournament.matches.length === tournament.type - 1){
        return res.status(401).json({
            ok: false,
            message: "Tournament ended"
        })
    }

    let newMatches = []

    // if (tournament.matches.length > 0){

    //     const match_without_winner = tournament.matches.find(match => !match.winner)
    
    //     if(match_without_winner){
    //         return res.status(400).json({
    //             ok: false,
    //             err: "There is not a match winner in all matches"
    //         })
    //     }

    // }

    body.date = new Date().getTime();

    const nextMatchesRound = (tournament.type - tournament.matches.length) / 2

    for (let index = 1; index <= nextMatchesRound; index++) {
        
        const name = `${req.body.name} (${index})`
        const match = await createMatch(req, name);

        if(match){
            newMatches.push(match._id)
        }else{
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Error creating the match"
                }
            })
        }
    }  
    console.log(newMatches)

    Tournament.updateMany({_id: tournament._id}, {$set: {'matches.match': newMatches}}, {new: true}, (err, tournamentDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            tournamentDB
        })

    })
        
    // const players = await nextRound(tournament._id, res)

    // console.log(players)
    
    // addPlayerToNextMatch(tournament._id, players)

}

const addPlayerToNextMatch = async (tournament_id, players) =>{


    const tournament = await Tournament.findOne({_id: tournament_id})

    players.forEach(element => {

        let matches = tournament.matches.filter(match => !match.player_1 && !match.winner);
    
        if (matches.length > 0) {
    
            matches[0].player_1 = element;
    
        } else {
    
            matches = tournament.matches.filter(match => !match.player_2 && !match.winner);
    
            if (matches.length > 0) {
    
                matches[0].player_2 = element;
    
            } else {
    
                return console.log("The tournament is full")
    
            }
        }
    });

    console.log(tournament)

    tournament.save()


}

const addPlayerToMatch = async (tournament_id, user) =>{

    const tournament = await Tournament.findOne({_id: tournament_id})

    const player_id = user

    if(! tournament){
        return res.status(404).json({
            ok: false,
            message: "Not found tournament"
        })
    }

    const playerInMatch = tournament.matches.filter(match => match.player_1 == player_id || match.player_2 == player_id)

    if(playerInMatch.length > 0){

        return console.log("The player is in match")
    }

    let matches = tournament.matches.filter(match => !match.player_1);

    if (matches.length > 0) {

        matches[0].player_1 = player_id;
        await tournament.save();

    } else {

        matches = tournament.matches.filter(match => !match.player_2);

        if (matches.length > 0) {

            matches[0].player_2 = player_id;
            await tournament.save();

        } else {

            return console.log("The tournament is full")

        }
    }

}

// TO DO: FIX!!!!!!!!!!!!!!!!!!!
const deletePlayer = async (req, res) =>{

    const tournament = await Tournament.findOne({_id: req.body.tournament})

    if(!tournament){
        return res.status(404).json({
            ok: false,
            err: "No match founded"
        })
    }

    const player_id = req.user

    if((tournament.type / 2) < tournament.matches.length) {
        return res.status(405).json({
            ok: false,
            err: "The match has started"
        })
    }

    const matches = tournament.matches;

    const matchToRemove = matches.find(match => match.player_1 == player_id || match.player_2 == player_id);

    // if(matchToRemove){
    //     delete matchToRemove.conflict;
    // }

    // res.send(matchToRemove);

    if (matchToRemove) {

        const propertyToRemove = matchToRemove.player_1 == player_id ? 'player_1' : 'player_2';

        matchToRemove[propertyToRemove] = null

        await tournament.save();

    }

    res.send(tournament)


}

/* TO DO:
    Añadir un ganador a la partida, si ya hay un ganador y el jugador selecciona otro. se va a entrar
    en conflicto y el admin deberá seleccionar el verdadero ganador
*/
const addWinner = async(req, res) => {

    const body = req.body

    const tournament = await Tournament.findOne({_id: body.tournament_id})

    // TO DO: Find by match no by tournament

    const match = await tournament.matches.find(match => match._id == body.match_id)


    if(match.hasOwnProperty("player_1") || match.hasOwnProperty("player_2")){
        return res.send(false)
    }

    if(match.conflict || match.closed){
        return res.json({
            ok: false
        })
    }

    if(!match.winner || match.winner != ""){
        match.conflict = true
    }else{
        match.winner = req.user
    }

    await tournament.save()

    res.json(tournament)

}

const nextRound = async (tournament_id, res) =>{

    const tournament = await Tournament.findOne({_id: tournament_id})

    // const match_without_winner = tournament.matches.find(match => !match.winner)

    // if(match_without_winner){
    //     return res.status(400).json({
    //         ok: false,
    //         err: "There is not a match winner in all matches"
    //     })
    // }

    const players = []

    tournament.matches.forEach(element => {
        if(element.winner){
            players.push(element.winner)
        }
    });

   return players


}


// TO DO:
// Crear un manejador de usuarios que pueda seleccionar 2 usuarios y acoplarlos a una partida, seguidamente
// con los demas usuarios hasta que las partidas queden llenas.
// Luego al terminar, el iniciar la siguiente ronda y pasar a los usuarios que van a la siguiente false.
// hasta llegar al ultimo

// TO DO: Final
// Crear un contador para el usuario por cada torneo ganado y crear un mensaje bonito de felicitaciones
// por ganar x torneo

module.exports = {
    createTournament,
    createTournamentMatches,
    addPlayerToMatch,
    deletePlayer,
    addWinner
}