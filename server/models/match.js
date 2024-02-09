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
        required: [true, "The date is required"]
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
    tournament_match:{
        type: Boolean,
        default: false
    },
    img: {
        type: String
    }
})

module.exports = mongoose.model('Match', matchSchema)