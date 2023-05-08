const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { Users } = require('../classes/user')
const { io } = require("../../server")

require('../../config/config');

const notificacionSocket = async(socket, users) => {

    socket.on('match_created', async(match) => {

        const match_url = `${process.env.URL}/match/${match._id}`

        let user = await User.findById(match.user)

        const data = {
            name: user.name,
            match_url,
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

const invitation_to_match = async(match) => {

    const match_url = `${process.env.URL}/match/${match._id}`

    let user = await User.findById(match.user)

    const data = {
        name: user.name,
        match_url,
    }

    io.emit('notification', data)

}


module.exports = {
    notificacionSocket,
}