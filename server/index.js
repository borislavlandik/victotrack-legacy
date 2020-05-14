const express = require('express')
const app = express()
const cors = require('cors')
const fetch = require('node-fetch')
const cookieParser = require('cookie-parser')

require('dotenv').config()

const PORT = process.env.PORT || 3000
const clientId = process.env.SPOTIFY_CLIENT_ID
const secretId = process.env.SPOTIFY_SECRET_ID

const clientUrl = 'http://localhost:8080'
const redirectUrl = 'http://localhost:3000/authorized'

app.use(cors())
app.use(cookieParser())

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
    const state = generateState(12)
    const params = {
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUrl,
        state: state,
        scope: 'playlist-read-private playlist-read-collaborative'
    }

    Object.keys(params).forEach(key => loginUrl.searchParams.append(key, params[key]))

    res.cookie('state', state)
    res.redirect(loginUrl)
})

app.get('/authorized', async (req, res) => {
    const state = req.query.state
    const error = req.query.error
    const code = req.query.code

    const responseState = req.cookies.state

    if (error || state !== responseState) {
        res.redirect(clientUrl)
    } else {
        res.clearCookie('state')

        const data = `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${clientId}:${secretId}`).toString('base64')}`
            },
            body: data
        }

        const response = await fetch('https://accounts.spotify.com/api/token', options)
        const json = await response.json()
        const accessToken = json.access_token

        res.cookie('user_token', accessToken, { maxAge: 30 * 60 * 1000 })
        res.redirect(`${clientUrl}/selection`)
    }
})

app.listen(PORT, 'localhost', () => {
    console.log(`Server started at ${PORT}`)
})
