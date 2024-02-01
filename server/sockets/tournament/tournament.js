/* TO DO:
Crear un socket para recibir a los usuarios que van ingresando al torneo
Cuando estos vayen ingresando se registraran automaticamente en la seccion del match
y seran emparejados automaticamente en orden, se guardara en la base de datos y deberá mostrarse
en tiempo real en la pantalla, el nombre de usuario y su imagen */

const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { Users } = require('../classes/user')
const { io } = require("../../server")
const Tournament = require("../../models/tournament");
const { addPlayerToMatch } = require('../../controllers/tournament');

require('../../config/config');

const tournamentSocket = async(socket, users) =>{
 
    socket.on("init_tournament", async(tournament_id) =>{
        
        const tournament = await Tournament.findOne({_id: tournament_id})

        if(!tournament){
            return console.log("It Doesn't exist")
        }


    })

    socket.on("add_user", async(tournament_id) => {

        const user = users.getUser(socket.id)

        addPlayerToMatch(tournament_id, user._id)
    })


}

module.exports = {
    tournamentSocket
}