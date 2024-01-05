const { getUsers } = require('../index');
const User = require('../../models/user')
const { io } = require('../../server')
const Match = require('../../models/match')

const CronJob = require('cron').CronJob

  

const job = new CronJob('0 */1 * * * *', function() {

    const d = new Date();


    Match.find({date: {$lt: d.getTime()}, active: true}, (err, matches) =>{
        if(err){
            return console.log(err)
        }
        

        matches.forEach(async match => {
            // let user = await User.findById(match.user)

        

            const data = {
                name: match.message,
                match: match._id
            }

            match.users.forEach(element => {
                
                const invited_user = getUsers().getUserById(element.toString())

                if(invited_user){

                    console.log(invited_user)
                    
                    io.to(invited_user.socket_id).emit("match_ready", data)
                    console.log("Notification a: " + invited_user.name);
                }
                
            });
        });
    })

});


job.start()

module.exports = job