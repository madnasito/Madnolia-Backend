const { io } = require('../server')
const { Users } = require('./classes/user')
const jwt = require('jsonwebtoken')

const users = new Users()

const { chatSocket } = require('./chat/messages')
const { notificacionSocket } = require('./notifications/notification')

io.on('connection', async(socket) => {

    socket.on('init_user', (token) => {
        jwt.verify(token, process.env.SEED, (err, decoded) => {

            if (err) {
                return
            }

            users.addUser(decoded.user, socket.id)
        })
    })

    // Delete user from Users conexions
    socket.on('disconnect', () => {
        users.deleteUser(socket.id)
    })

    chatSocket(socket, users)
    notificacionSocket(socket, users)

})