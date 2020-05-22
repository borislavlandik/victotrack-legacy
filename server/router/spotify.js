const fetch = require('node-fetch')
const generators = require('../services/generators')

const users = []

const clientId = process.env.SPOTIFY_CLIENT_ID
const secretId = process.env.SPOTIFY_SECRET_ID

const clientUrl = 'http://localhost:8080'
const redirectUrl = 'http://localhost:3000/authorized'

module.exports = function (app) {
    app.get('/login', (req, res) => {
        const loginUrl = new URL('https:accounts.spotify.com/authorize')
        const state = generators.generateState(12)
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

            const userId = generators.generateId('u')

            users.push({
                userId: userId,
                accessToken: json.access_token,
                refreshToken: json.refresh_token
            })

            console.log('USERS:')
            users.forEach(user => console.log(user))

            res.cookie('user_id', userId)
            res.redirect(`${clientUrl}/selection`)
        }
    })
}
