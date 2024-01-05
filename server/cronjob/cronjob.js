const CronJob = require('cron').CronJob
const res = require('express/lib/response');
const Match = require('../models/match');
const { substractGameMatch } = require('../controllers/game');

console.log('Before job instantiation');

const job = new CronJob('0 */2 * * * *', function() {
	const d = new Date();


	Match.find({date: {$lt: d.getTime()}, active: true}, (err, matches) =>{
		if(err){
			return console.log(err)
		}
		matches.forEach(element => {
			substractGameMatch(element.game_id, element.platform)
		});
	})

	Match.updateMany({date: {$lt: d.getTime()}, active: true}, {active: false},(err) =>{
		if(err){
			return console.log(err)
		}
	})

});
console.log('After job instantiation');
job.start();


module.exports = job
