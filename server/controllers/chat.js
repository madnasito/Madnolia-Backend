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
}