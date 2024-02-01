const { io } = require('../server')
const { Users } = require('./classes/user')

const users = new Users()

const { chatSocket } = require('./chat/messages')
const { notificacionSocket } = require('./notifications/notification')
const { verifySocketToken } = require('../middleware/autentication')
const { tournamentSocket } = require('./tournament/tournament')

io.on('connection', async(client) => {
    

    
    if(!client.handshake.headers["x-token"]){
        return;
    }

    const [valid, user] = verifySocketToken(client.handshake.headers["x-token"])

    


    // // Verificar autenticación
    if(!valid){
        return client.disconnect();

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
        users.deleteUser(client.id)
    })


    chatSocket(client, users)
    notificacionSocket(client, users)

    tournamentSocket(client, users)

})

const getUsers = () => users;

module.exports = {
    getUsers
}
require('./notifications/cronjob')
