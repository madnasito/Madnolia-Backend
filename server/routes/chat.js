<<<<<<< HEAD
// const express = require('express')
// const { check } = require('express-validator')

// const app = express()

// const { sendMessage } = require('../controllers/chat')
// const { verifyToken } = require('../middleware/autentication')
// const { validFields } = require('../middleware/valid_fields')

// app.post("/chat/send_message", [
//         check('message', 'We need a message').not().isEmpty(),
//         validFields,
//         verifyToken
//     ],
//     sendMessage)

// module.exports = app
=======
const express = require('express')
const { check } = require('express-validator')

const app = express()

const { sendMessage } = require('../controllers/chat')
const { verifyToken } = require('../middleware/autentication')
const { validFields } = require('../middleware/valid_fields')

app.post("/chat/send_message", [
        check('message', 'We need a message').not().isEmpty(),
        validFields,
        verifyToken
    ],
    sendMessage)

module.exports = app
>>>>>>> 3f575ba2f65495761cb8fbe59ed74702355a3a32
