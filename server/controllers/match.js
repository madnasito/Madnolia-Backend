const Match = require('../models/match')
const _ = require('underscore')
const User = require('../models/user')
const Game = require('../models/game')
const { createGame, addGameMatch, getGamesByPlatforms } = require('./game')
const { substractGameMatch } = require('../controllers/game');
const { notificacionSocket } = require('../sockets/notifications/notification')


// Creating a Match
const createMatch = async(req, res) => {
    const body = req.body

    if(body.name == ""){
        body.name = "Casual Match"
    }

    const match = new Match({
        game_name: body.game_name,
        game_id: body.game_id,
        platform: body.platform,
        date: body.date,
        user: req.user,
        message: body.name,
        img: body.img,
        users: body.users,
    })


    let game = await Game.findOne({ game_id: body.game_id })


    if (game) {
        addGameMatch(req, res)
    }
    if (!game) {
        await createGame(req, res)
    }



    match.save((err, matchDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        User.findByIdAndUpdate(req.user, { $push: { 'matches': matchDB._id } }, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        })

        User.updateMany({ _id: { $in: body.users } }, { $push: { 'invitations': matchDB._id }, $inc: { notifications: 1 } }, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        })

        notificacionSocket(matchDB)

        res.json({
            ok: true,
            matchDB
        })
    })
}

// Edit a Match
const editMatch = async(req, res) => {
    const uid = req.user
    const matchId = req.body._id

    try {

        const matchDB = await Match.findById(matchId)

        if (matchDB.user != uid) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Unauthorized"
                }
            })
        }

        // Updating Match
        let body = _.pick(req.body, ['name', 'platform', 'date', 'game', 'img'])

        Match.findByIdAndUpdate(matchId, body, { new: true }, (err, updatedMatch) => {
            // Verify Errors
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            // Match Updated
            res.json({
                ok: true,
                updatedMatch,
                message: 'Match updated!'
            })
        })

    } catch (error) {
        console.log(error)
    }
}

// Get a match whatever want
const getMatch = async(req, res) => {

    const id = req.params.id

    if (!id) {
        return
    }

    try {
        Match.findById(id)
            // .select({ chat: { $slice: -10 } })
            // .sort('chat.date')
            .populate('chat.user', 'username thumb_img name')
            .populate('users', 'username')
            .exec((err, matchDB) => {

                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    match: matchDB
                })
            })
    } catch (error) {
        console.log(error)
    }
}

// Delete a Match
const deleteMatch = async(req, res) => {
    const uid = req.user
    const matchId = req.params.id

    Match.findOneAndDelete({ _id: matchId, user: uid }, (err, matchDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!matchDB) {
            return res.status(401).json({
                ok: false,
                message: 'Not found'
            })
        }

        substractGameMatch(matchDB.game_id, matchDB.platform)


        // Match Updated
        res.json({
            ok: true,
            message: 'Match deleted'
        })

    })

}

// Player's Matches
const playerMatches = async(req, res) => {

    const user = req.user

    let skip = Number(req.query.skip) || 0;

    Match.find({ user })
        .skip(skip)
        
        .limit(30)
        .sort({ _id: -1 })
        .exec((err, matches) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                matches
            })

        })
}

// Matches of Platform
const matchesByPlatform = async(req, res) => {

    const platform = req.params.platform
    let skip = Number(req.query.skip) || 0;

    let topGames = {}

    Match.find({ platform, active: true })
        .sort(-1)
        .exec((err, matches) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }


            for (let i = 0; i < matches.length; i++) {

                Match.find({ platform, active: true, game_name: matches[i].game_name })
                    .count()
                    .exec((err, matchCount) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                err
                            })
                        }
                        topGames[matches[i].game_name] = matchCount
                    })
            }

            console.log(topGames)

            res.send(matches)
        })

}

// Matches of Platform
const getMatchesByPlatform = async(platform, skip) => {
    

    let topGames = {}

    Match.find({ platform, active: true })
        // .sort(-1)
        .exec((err, matches) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }


            for (let i = 0; i < matches.length; i++) {

                Match.find({ platform, active: true, game_name: matches[i].game_name })
                    .count()
                    .exec((err, matchCount) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                err
                            })
                        }
                        topGames[matches[i].game_name] = matchCount
                    })
                
                console.log(topGames)
            }

            return matches
        })
}
// Matches by game and platform
const platformGameMatches = (req, res) => {

    let skip = Number(req.query.skip) || 0
    const limit = 20
    const game_id = req.params.game
    const platform = req.params.platform

    if (!game_id || game_id == "" || !platform || platform == "") {
        return res.status(404).json({
            ok: false,
            err: {
                message: "Invalid fields"
            }
        })
    }

    Match.find({ game_id, platform, active: true })
        .skip(skip)
        .limit(limit)
        // .sort({})
        .exec((err, matchesDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.send(
                matchesDB
            )
        })

}


// Exporting general Matches
module.exports = { createMatch, getMatch, editMatch, deleteMatch, playerMatches, matchesByPlatform,getMatchesByPlatform,  platformGameMatches }