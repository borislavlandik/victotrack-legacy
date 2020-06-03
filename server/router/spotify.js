const fetch = require('node-fetch')
const generators = require('../services/generators')

const clientId = process.env.SPOTIFY_CLIENT_ID
const secretId = process.env.SPOTIFY_SECRET_ID

const clientUrl = 'http://localhost:8080'
const redirectUrl = 'http://localhost:3000/authorized'

const users = []

async function refreshToken (user) {
    const data = `grant_type=refresh_token&refresh_token=${user.refreshToken}`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${secretId}`).toString('base64')}`
        },
        body: data
    }

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', options)
    const tokenJson = await tokenResponse.json()

    user.accessToken = tokenJson.access_token
    user.refreshToken = tokenJson.refresh_token
}

async function spotifyRequest (endpoint, user) {
    const options = {
        headers: {
            Authorization: `Bearer ${user.accessToken}`
        }
    }

    let response = await fetch(endpoint, options)

    if (response.status === 401) {
        await refreshToken(user)
        response = await fetch(endpoint, options)
    }

    return await response.json()
}

module.exports.app = function (app) {
    app.get('/login', (req, res) => {
        const loginUrl = new URL('https://accounts.spotify.com/authorize')
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

            const tokenResponse = await fetch('https://accounts.spotify.com/api/token', options)
            const tokenJson = await tokenResponse.json()

            const userResponse = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${tokenJson.access_token}`
                }
            })

            const userJson = await userResponse.json()
            const userId = userJson.id

            if (users.find(user => user.id === userId) === undefined) {
                users.push({
                    id: userId,
                    accessToken: tokenJson.access_token,
                    refreshToken: tokenJson.refresh_token
                })
            }

            res.cookie('user_id', userId)
            res.redirect(`${clientUrl}/selection`)
        }
    })

    app.get('/playlists', async (req, res) => {
        if (req.cookies.user_id === undefined) {
            return res.sendStatus(403)
        }

        const user = users.find(user => user.id === req.cookies.user_id)
        const playlists = await spotifyRequest('https://api.spotify.com/v1/me/playlists', user)

        res.send(JSON.stringify(playlists))
    })

    app.get('/tracks', async (req, res) => {
        const query = req.query

        if ((Object.keys(query).length === 0 && query.constructor === Object) ||
            query.playlistId === undefined) {
            return res.sendStatus(422)
        }

        if (req.cookies.user_id === undefined) {
            return res.sendStatus(403)
        }

        const user = users.find(user => user.id === req.cookies.user_id)
        const tracks = await spotifyRequest(`https://api.spotify.com/v1/playlists/${query.playlistId}/tracks`, user)
        res.send(JSON.stringify(tracks))
    })
}

module.exports.users = users
module.exports.request = spotifyRequest
