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

const server = app.listen(PORT)
const io = require('socket.io').listen(server)

app.use(cors())
app.use(cookieParser())

const rooms = []

io.on('connection', (socket) => {
    socket.on('createRoom', (playerName) => {
        const roomId = generateRoomId()

        socket.join(roomId)

        const room = {
            roomId: roomId,
            isGameStarted: false,
            players: {
                leaderId: socket.id,
                connected: [
                    {
                        name: playerName,
                        id: socket.id
                    }
                ]
            },
            tracks: {}
        }
        rooms.push(room)

        socket.emit('roomCreated', roomId)
        socket.emit('playersUpdate', room.players.connected)

        console.log('\x1b[32m%s\x1b[0m', 'ROOM CREATED:', 'Room ID: ', room.roomId)
        console.log('Players: ', room.players.connected)
    })

    socket.on('addPlayer', (roomId, playerName, response) => {
        const room = rooms.find(room => room.roomId === roomId)

        if (room === undefined) {
            return response({
                status: 'error',
                message: 'Этой комнаты не существует'
            })
        }

        if (room.isGameStarted) {
            return response({
                status: 'error',
                message: 'В этой комнате игра уже началась'
            })
        }

        if (room.players.connected.some(player => player.id === socket.id)) {
            return response({
                status: 'error',
                message: 'Этот игрок уже состоит в данной комнате'
            })
        }

        room.players.connected.push({
            name: playerName,
            id: socket.id
        })

        console.log('\x1b[32m%s\x1b[0m', 'PLAYER ADDED:', 'Room ID: ', room.roomId)
        console.log('Players: ', room.players.connected)

        socket.to(roomId).broadcast.emit('playersUpdate', room.players.connected)

        return response({
            status: 'ok'
        })
    })

    socket.on('startGame', (roomId, response) => {
        const room = rooms.find(room => room.roomId === roomId)

        if (socket.id !== room.players.leaderId) {
            return response('Этот пользователь не может начинать игру')
        }

        room.isGameStarted = true
    })
})

function generateRoomId () {
    const roomIds = rooms.map(room => room.roomId)

    let roomId
    while (true) {
        roomId = Math.floor(Math.random() * 1000000)

        if (roomIds.every(id => roomId !== id)) {
            break
        }
    }

    return roomId.toString()
}

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
