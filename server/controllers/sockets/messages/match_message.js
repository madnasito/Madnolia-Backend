const MatchMessage = require('../../../models/match_message')

const createMatchMessage = (data) => {
    let message = new MatchMessage({
        user: data.user,
        date: new Date().getTime(),
        text: data.text,
        room: data.room
    });

    message.save((err, messageDB) =>{
        if(err){
            return console.log(err)
        }

        return messageDB;
    })
}

module.exports = {
    createMatchMessage
}