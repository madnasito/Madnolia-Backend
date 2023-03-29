const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Match = require('../models/match')

const saveMessage = (message, user, match_id) => {

    const new_message = {
        user,
        date: new Date().getTime(),
        text: message
    }


    Match.updateOne({ _id: match_id }, { $push: { 'chat': new_message } }, { new: true }, (err) => {
        if (err) {
            return console.log(err)
        }

    })

}

module.exports = {
    saveMessage
}