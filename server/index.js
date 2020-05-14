const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()

const PORT = process.env.PORT || 3000
const clientId = process.env.SPOTIFY_CLIENT_ID

const redirectUri = 'http://localhost:3000/'

app.use(cors())

function generateState (length) {
    let state = ''
    const possibleChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrtsuvwxyz'

    for (let i = 0; i < length; i++) {
        state += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
    }

    return state
}

app.get('/login', (req, res) => {
    const loginUrl = new URL('https:accounts.spotify.com/authorize')
    const params = {
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        state: generateState(12),
        scope: 'playlist-read-private playlist-read-collaborative'
    }

    Object.keys(params).forEach(key => loginUrl.searchParams.append(key, params[key]))

    res.redirect(loginUrl)
})

app.listen(PORT, 'localhost', () => {
    console.log(`Server started at ${PORT}`)
})
