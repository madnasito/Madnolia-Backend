const Game = require('../models/game')
const http = require('http')

const api_key = "8af7cb7fc9d949acac94ab83be57ed1b"

var options = {
    host: 'https://api.rawg.io',
    path: '/api/games/',
    method: 'GET'
}

const createGame = async(req, res) => {

    const body = req.body

    Game.findOne({ game_id: body.game_id })
        .exec((err, game) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })

            }
            if (!game) {
                http.request({
                    host: "www.api.rawg.io",
                    path: `/api/games/${body.game_id}?key=${api_key}`,
                    method: 'GET'
                }, (res) => {
                    var str = ''

                    res.on('data', (chunk) => {
                        str += chunk
                    })
                    res.on('end', () => {
                        res.send(str)
                    })
                })
                console.log("mage")
                res.send("nada")
            }
        })
}

module.exports = {
    createGame
}