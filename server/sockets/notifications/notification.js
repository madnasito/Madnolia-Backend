const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Match = require("../../models/match")


require('../../config/config');

const notificacionSocket = async(socket, users) => {

    socket.on('match_created', async(matchId) => {

        try {
            
            const match = await Match.findOne({_id: matchId});
    
            const match_url = `${process.env.URL}/match/${match._id}`
    
            let user = await User.findById(match.user)
    
    
            const data = {
                name: user.name,
                match_url,
                match: match._id,
                img: match.img
            }
    
    
            
            match.users.forEach(element => {
                const invited_user = users.getUserById(element.toString())
                if (invited_user) {
                    socket.to(invited_user.socket_id).emit('notification', (data))
                }
            });

        } catch (error) {
            return console.log(error)
        }


    })

    socket.on("join_to_match", async(data) => {

        const user = users.getUser(socket.id)
        try {
            
            let matchDB = await Match.findOne({_id: data})

            if(matchDB){
                
                
                await Match.findOneAndUpdate({ _id: data }, { $addToSet: { likes: user._id } }, (err) => {
                    if (err) {
                        return console.log(err);
                    }
                
                    socket.emit("added_to_match", true);
                    socket.to(matchDB._id.toString()).emit("new_player_to_match", {
                        _id: user._id,
                        name: user.name,
                        thumb_img: user.thumb_img,
                        username: user.username
                    })
                });
                

            }else{
                socket.emit("added_to_match", false)    
            }
            

        } catch (error) {
            
            socket.emit("added_to_match", false)
            return console.log("No founded match")
        }


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
        const userHost = users.getUserById(_id.toString())
        if(userHost) {
            socket.to(userHost.socket_id).emit('match_ready', (data))
        }
    });
        

}


module.exports = {
    notificacionSocket,
    matchReadySocket
}
