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
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
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
    chat: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        date: {
            type: Number,
        },
        text: {
            type: String,
        },
        _id: {
            type: mongoose.Schema.Types.ObjectId
        }
    }]
})

module.exports = mongoose.model('Match', matchSchema)