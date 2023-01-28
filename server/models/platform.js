const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validCategory = {
    values: ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Mobile', 'PC', 'Mobile']
}

const platformSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    api_id: {
        type: Number,
        required: true
    },
    ico: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: validCategory
    },
    date: {
        type: Date
    },
    games: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }
})

module.exports = mongoose.model('Platform', platformSchema)