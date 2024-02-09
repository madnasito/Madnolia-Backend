const mongoose = require("mongoose")
const Schema = mongoose.Schema

const matchMessageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    text: {
        type: String,
    },
    room:{
        type: Schema.Types.ObjectId,
        ref: "Match",
        required: true
    }
})

module.exports = mongoose.model("MatchMessage", matchMessageSchema);