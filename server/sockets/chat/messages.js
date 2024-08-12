// const { io } = require('../../server')


const { createMatchMessage } = require("../../controllers/sockets/messages/match_message");

// const jwt = require('jsonwebtoken')
const { saveMessage } = require('../../controllers/chat')
// const { Users } = require('../classes/user')
    // const users = new Users()

const chatSocket = (socket, users) => {

    // Sign up for user
    socket.on('init_match_chat', (data) => {

        if (!users.getUser(socket.id)) {
            setTimeout(() => {
                users.getUser(socket.id).match = data
                socket.join(data)
            }, 100);
        } else {
            users.getUser(socket.id).match = data
            socket.join(data)
        }

    })

    socket.on('message', (data) => {

        const {message, room} = data
        

        const user = users.getUser(socket.id)   
        if (!user) {
            return
        }
        const { match, _id } = user
        const socketMessage = createMessage(user, message, room)
        
        createMatchMessage(socketMessage);

        socket.to(room).emit('message', socketMessage)
        socket.emit('message', socketMessage)
    })


    socket.on('disconnect_chat', () => {
        users.getUser(socket.id).match = ''
    })

}

const createMessage = (user, message, room) => {

    return {
        date: new Date().getTime(),
        user: {
            _id: user._id,
            username: user.username,
            thumb_img: user.thumb_img,
            name: user.name
        },
        text: message,
        room
    }
}

module.exports = {
    chatSocket
}