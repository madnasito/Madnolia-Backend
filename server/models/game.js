const mongoose = require('mongoose')
const Schema = mongoose.Schema


let validPlatforms = {
    values: [
        '15', '16', '17', '18', '19', '187',
        '1', '80', '14', '186',
        '7', '8', '10', '11', '2'
    ]
}

const gameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    game_id: {
        type: Number,
    },
    platforms: {
        type: [{
            platform_id: {
                type: Number,
                amount: {
                    type: Number,
                    default: 1
                },
                enum: validPlatforms
            }
        }]
    },
    img: {
        type: String
    },
    screenshots: [{
        type: String
    }],
    description: String
})

module.exports = mongoose.model('Game', gameSchema)