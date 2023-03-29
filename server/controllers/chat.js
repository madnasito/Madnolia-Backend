<<<<<<< HEAD
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
=======
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Chat = require('../models/chat')

const sendMessage = (req, res) => {

    const body = req.body

    let message = {
        user: req.user,
        date: new Date(),
        text: body.message
    }

    Chat.findOneAndUpdate({ match: body.match }, { $push: { 'message': message } }, (err, chatDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }
        res.send(chatDB)
    })

    // res.send(body)
}

module.exports = {
    sendMessage
>>>>>>> 3f575ba2f65495761cb8fbe59ed74702355a3a32
}