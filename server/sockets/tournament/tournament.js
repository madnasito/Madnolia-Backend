/* TO DO:
Crear un socket para recibir a los usuarios que van ingresando al torneo
Cuando estos vayen ingresando se registraran automaticamente en la seccion del match
y seran emparejados automaticamente en orden, se guardara en la base de datos y deberá mostrarse
en tiempo real en la pantalla, el nombre de usuario y su imagen */

const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { Users } = require('../classes/user')
const { io } = require("../../server")

require('../../config/config');

const tournamentSocket = async(socket, users) =>{
 
    // Sign up for user in match
}