const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Match = require("../../models/match")


require('../../config/config');

const notificacionSocket = async(socket, users) => {

    socket.on('match_created', async(match) => {

        const match_url = `${process.env.URL}/match/${match._id}`

        let user = await User.findById(match.user)


        const data = {
            name: user.name,
            match_url,
            match
        }


        const socket_user = users.getUser(socket.id)

        const { _id } = user
        match.users.forEach(element => {
            const invited_user = users.getUserById(element.toString())
            if (invited_user) {
                socket.broadcast.to(invited_user.socket_id).emit('notification', (data))
            }
        });


    })
    

}





const matchReadySocket = async(match_id, users) => {

    let user = await User.findById(match.user)

    const match = await Match.findOne({_id: match_id});

    const data = {
        message: `The match ${match.message} will start soon`,
        id: match._id,
    }


    const { _id } = user
    match.users.forEach(element => {
        const invited_user = users.getUserById(element.toString())
        if (invited_user) {
            socket.broadcast.to(invited_user.socket_id).emit('match_ready', (data))
        }
    });
        

}


module.exports = {
    notificacionSocket,
    matchReadySocket
}
