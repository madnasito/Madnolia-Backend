const express = require("express")
const mongoose = require('mongoose')

const Platform = require('../models/platform')
const User = require('../models/user')

const app = express()

const getUserPlatforms = async(req, res) => {

    let user_platforms = await User.findById(req.user)

    user_platforms = user_platforms.platforms

    let platforms = await Platform.find({ api_id: user_platforms })

    res.send(platforms)
}


const createPlatform = async(req, res) => {

    const body = req.body

    const platform = new Platform({
        name: body.name,
        api_id: body.api_id,
        ico: body.ico,
        category: body.category
    })

    platform.save((err, platformDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            platformDB
        })
    })

}

const getPlatform = async(req, res) => {
    const platform = req.params.platform

    Platform.findOne({ api_id: platform }).
    exec((err, platformDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }

        res.send(platformDB)
    })
}

module.exports = {
    createPlatform,
    getUserPlatforms,
    getPlatform
}