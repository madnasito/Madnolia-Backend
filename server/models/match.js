const mongoose = require('mongoose');
const Schema = mongoose.Schema

const matchSchema = new Schema({
    game_name: {
        type: String,
        required: true
    },
    game_id: {
        required: [true, 'Hey you forgot your game!'],
        type: String
    },
    platform: {
        type: Number,
        required: [true, 'Need platform']
    },
    date: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        default: 'Casual Match'
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    active: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    },
    chat: {
        message: [{
            user: {
                type: String,
                required: true
            },
            date: {
                type: Date
            },
            text: {
                type: String,
                required: true
            }
            // type: Schema.Types.ObjectId,
            // ref: 'message'
        }],
    }
})

module.exports = mongoose.model('Match', matchSchema)