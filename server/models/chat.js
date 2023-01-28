const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
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
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }
})

module.exports = mongoose.model('Chat', chatSchema)