<<<<<<< HEAD
const express = require('express')

const app = express()



app.use(require('./user'))
app.use(require('./match'))
app.use(require('./auth'))
app.use(require('./platform'))
    // app.use(require('./chat'))
app.use(require('./uploads'))

=======
const express = require('express')
const app = express()

app.use(require('./user'))
app.use(require('./match'))
app.use(require('./auth'))
app.use(require('./platform'))
app.use(require('./chat'))
app.use(require('./uploads'))

>>>>>>> 3f575ba2f65495761cb8fbe59ed74702355a3a32
module.exports = app