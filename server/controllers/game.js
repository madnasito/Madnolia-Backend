const axios = require('axios')

const Game = require('../models/game')

const api_key = "8af7cb7fc9d949acac94ab83be57ed1b"

const createGame = async(req) => {

    const body = req.body

    Game.findOne({ game_id: body.game_id })
        .exec((err, game) => {
            if (err) {
                addGameMatch(req)
            }
            if (!game) {

                axios.get(`https://api.rawg.io/api/games/${body.game_id}?key=${api_key}`)
                    .then(response => {
                        game_db = response.data
                        let platforms_db = []
                        game_db.platforms.forEach(element => {
                            if (element.platform.id) {
                                if (element.platform.id === Number(body.platform)) {
                                    platforms_db.push({ platform_id: Number(element.platform.id), amount: 1 })
                                } else {
                                    platforms_db.push({ platform_id: Number(element.platform.id), amount: 0 })
                                }
                            }
                        });
                        let game = new Game({
                            name: game_db.name,
                            game_id: game_db.id,
                            platforms: platforms_db,
                            background_image: game_db.background_image
                        })

                        game.save()
                    }).catch(error => {
                        return console.log(error)

                    })

            }
        })
}

const addGameMatch = async(req) => {

    const game_id = req.body.game_id
    const platform = req.body.platform
    Game.findOneAndUpdate({ game_id: game_id, platforms: { $elemMatch: { platform_id: Number(platform) } } }, {
        $inc: {
            "platforms.$.amount": 1
        }
    }, { new: true }, (err, gameDB) => {
        if (err) {
            return console.log(err)
        }
    })
}

const substractGameMatch = async (game_id, platform_id) =>{

    const platform = platform_id
    Game.findOneAndUpdate({ game_id: game_id, platforms: { $elemMatch: { platform_id: Number(platform) } } }, {
        $inc: {
            "platforms.$.amount": -1
        }
    }, { new: true }, (err, gameDB) => {
        if (err) {
            return console.log(err)
        }
    })
}

const geTotalGameMatchesByPlatform = async(req) => {

    const game_id = req.params.game
    const platform_id = Number(req.params.platform)

    Game.find({ game_id, platforms: { $elemMatch: { platform_id } } }, (err, TotalDB) => {

        if (err) {
            return console.log(err)
        }

    })

}

const getGamesByPlatforms = async(req, res) => {

    const platform = req.params.platform

    Game.find({ platforms: { $elemMatch: { platform_id: Number(platform) } } })
        .limit(9)
        .sort({ 'platforms.amount': -1 })
        .exec((err, total) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                total
            })
        })

}

const gamesByPlatforms = async(platform) => {    

    Game.find({ platforms: { $elemMatch: { platform_id: Number(platform) } } })
        .limit(9)
        .sort({ 'platforms.amount': -1 })
        .exec((err, total) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            
        })


}

module.exports = {
    createGame,
    addGameMatch,
    getGamesByPlatforms,
    geTotalGameMatchesByPlatform,
    substractGameMatch, gamesByPlatforms
}