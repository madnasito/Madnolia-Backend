const { io } = require('../server')
const { Users } = require('./classes/user')

const users = new Users()
const Match = require('../models/match')

const { chatSocket } = require('./chat/messages')
const { notificacionSocket } = require('./notifications/notification')
const { verifySocketToken } = require('../middleware/autentication')
const { tournamentSocket } = require('./tournament/tournament')
const match = require('../models/match')

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



    users.addUser(user, client.id)

    
    // addUserToRooms(user)
    
    // users.addUser(user, client.id)
    
    // Delete user from Users conexions
    client.on('disconnect', () => {
        users.deleteUser(client.id)
    })
    
    
    chatSocket(client, users)
    notificacionSocket(client, users)
    addUserToRooms(client, user)

    tournamentSocket(client, users)

})

const getUsers = () => users;

const addUserToRooms = async (client, user) =>  {

    let matches = []
    await Match.find({$or:[  {likes:{ $eq: user}}, {user: user}], active: true}, (err, matchDB) =>{

        if(err){
            return console.log(err)
        }
        matchDB.map(doc => matches.push(doc._id.toString()));

        matches.forEach(element => {
            client.join(element)
        });
        
    });
    
}

module.exports = {
    getUsers
}
require('./notifications/cronjob')
