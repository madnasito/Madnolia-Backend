const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Match = require('../models/match')

const saveMessage = (message, user, room) => {

    const new_message = {
        user,
        date: new Date().getTime(),
        text: message,
        room
    }


    Match.updateOne({ _id: room }, { $push: { 'chat': new_message } }, { new: true }, (err) => {
        if (err) {
            return console.log(err)
        }

    })

}

module.exports = {
    saveMessage
}