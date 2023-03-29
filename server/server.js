<<<<<<< HEAD
const express = require('express');
const app = express()

const colors = require('colors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const http = require('http')
const publicPath = path.resolve(__dirname, '../public');
const cors = require('cors')
const socketIO = require('socket.io')

app.use(cors())

let server = http.createServer(app)

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index'))

app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(`${path.dirname(__dirname)}/public/index.html`)
})

mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) {
        console.log('Error en la base de datos'.red)
        return console.log(err)
    }

    console.log('Conectado en la base de datos'.green)
});

// This is backend's comunication
const io = socketIO(server, {
    cors: {
        origins: ["http://localhost:4200"]
    }
})

module.exports = { io }
require('./sockets/index')

server.listen(process.env.PORT, () => {
    console.log("Servidor en el puerto:", process.env.PORT.green)

=======
const express = require('express');
const app = express()

const colors = require('colors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors')

const publicPath = path.resolve(__dirname, '../public');

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())

app.use(cors())

app.use(require('./routes/index'))

app.use(express.static(publicPath));

mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) {
        console.log('Error en la base de datos'.red)
        return console.log(err)
    }

    console.log('Conectado en la base de datos'.green)
});


app.listen(process.env.PORT, () => {
    console.log("Servidor en el puerto:", process.env.PORT.green)
>>>>>>> 3f575ba2f65495761cb8fbe59ed74702355a3a32
})