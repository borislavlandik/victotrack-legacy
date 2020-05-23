const express = require('express')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT || 3000
const server = app.listen(PORT)

app.use(require('cors')({
    origin: ['http://localhost:8080'],
    credentials: true
}))
app.use(require('cookie-parser')())

require('./router/spotify')(app)
require('./router/sockets')(server)
