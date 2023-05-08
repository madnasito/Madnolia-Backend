const { io } = require('../../server')
const jwt = require('jsonwebtoken')
const { saveMessage } = require('../../controllers/chat')
const { Users } = require('../classes/user')
    // const users = new Users()

const chatSocket = (socket, users) => {


    // Sign up for user
    socket.on('init_match_chat', (data) => {

        if (!users.getUser(socket.id)) {
            setTimeout(() => {
                users.getUser(socket.id).match = data
                socket.join(data.match)
            }, 100);
        } else {
            users.getUser(socket.id).match = data
            socket.join(data)
        }

    })



    socket.on('enterChat', async(data) => {

        socket.join(data)

    })

    socket.on('message', async(message) => {
        const user = await users.getUser(socket.id)
        const { match, _id } = user
        const mensaje = createMessage(user, message)
        socket.broadcast.to(match).emit('message', mensaje)
        socket.emit('message', mensaje)
        saveMessage(message, _id, match)
    })



    socket.on('disconnect_chat', () => {
        users.getUser(socket.id).match = ''
    })

}

const createMessage = (user, message) => {

    return {
        date: new Date().getTime(),
        user: {
            _id: user._id,
            username: user.username,
            img: user.img,
            name: user.name
        },
        text: message
    }
}

module.exports = {
    chatSocket
}