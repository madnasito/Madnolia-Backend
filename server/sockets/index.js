const { io } = require('../server')
const { Users } = require('./classes/user')
const jwt = require('jsonwebtoken')

const users = new Users()

const { chatSocket } = require('./chat/messages')
const { notificacionSocket } = require('./notifications/notification')
const { verifySocketToken } = require('../middleware/autentication')

io.on('connection', async(client) => {


    const [valid, user] = verifySocketToken(client.handshake.headers["x-token"])


    // // Verificar autenticación
    if(!valid){
        return client.disconnect();

    }else{
        console.log("Coneto")
    }

    // client.on('init_user', (token) => {
    //     jwt.verify(token, process.env.SEED, (err, decoded) => {

    //         if (err) {
    //             return
    //         }

    //         // console.log(decoded)

    //     })
    // })

    // console.log(client.id)
    users.addUser(user, client.id)

    // users.addUser(user, client.id)

    // Delete user from Users conexions
    client.on('disconnect', () => {
        console.log("Desconectado")
        users.deleteUser(client.id)
    })

    chatSocket(client, users)
    notificacionSocket(client, users)

})