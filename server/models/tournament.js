const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Number of participants in tournament
const tournamentTypes = {
    values: ["4", "8", "16", "32", "64"],
    message: "{VALUE} Is not a valid number of players"
}

const tournamentSchema = new Schema({
    name: {
        type: String,
        required: true,
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
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    type:{
        type: String,
        default: "4",
        enum: tournamentTypes,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    matches : [{
        match: {
            type: Schema.Types.ObjectId,
            ref: 'Match',
            required: true
        },
        player_1: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        player_2: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        winner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        conflict:{
            type: Boolean,
            default: false
        },
        closed: {
            type: Boolean,
            default: false
        },
        // _id: false
    }],
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

module.exports = mongoose.model("Tournament", tournamentSchema)