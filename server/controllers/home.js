const express = require("express");
const app = express()
const jwt = require("jsonwebtoken");

const User = require("../models/user")
const Game = require("../models/game")
const Platform = require('../models/platform')
const Match = require("../models/match")

const { getMatchesByPlatform } = require("./match");
const { gamesByPlatforms } = require("./game");

const userHomeGames = async(req, res )=> {

    const user = await User.findById(req.user)

    if(!user){
        return res.status(404).json({
            ok: false,
            err: "Not found user"
        })
    }

    const user_platforms = user.platforms

    let platforms = await Platform.find({ api_id: user_platforms })

    let games = [];

    try {
        const platformQueries = platforms.map(async (element) => {
            const value = await Game.find({
                platforms: {
            $elemMatch: {
                platform_id: Number(element.api_id),
                amount: { $gt: 0 } // Filter for amount greater than 0
            }
        }
 
            })
                .limit(9)
                .sort({ 'platforms.amount': -1 });
            return {
                "name": element.name,
                "platform": element.api_id,
                "platform_category": element.category,
                "games": value
            };
        });

        const results = await Promise.all(platformQueries);
        games.push(...results); // Use spread syntax to flatten the array

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, err: "Error fetching games" });
        return;
    }


    res.json({
        ok: true,
        platforms: games
    })


}

module.exports = {
    userHomeGames
}
