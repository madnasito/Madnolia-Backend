const express = require("express");
const app = express()

const MatchMessage = require("../../../models/match_message")

const getMatchMessages = async(req, res) => {
    const body = req.body;
    let skip = Number(req.query.skip) || 0;
    
    MatchMessage.find({room: body.match})
                .populate("user", "_id username thumb_img name")
                .limit(40)
                .sort({ _id: -1 })
                .skip(skip)
                .exec((err, messages) =>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    res.json({
                        ok: true,
                        messages
                    })
                })
}

module.exports = {
    getMatchMessages
}