const generators = require('../services/generators')

const rooms = new Map()

class Room {
    constructor (id) {
        this.roomId = id
        this.isGameStarted = false
        this.rounds = 10
        this.players = {
            leaderId: null,
            connected: []
        }
        this.tracks = []
    }

    setLeader (id) {
        this.players.leaderId = id
    }

    addPlayer (id, name) {
        this.players.connected.push({
            id: id,
            name: name,
            score: 0
        })
    }

    startGame (io) {
        this.isGameStarted = true
        this.newRound(io, 0)
    }

    newRound (io, currentRound) {
        if (currentRound === this.rounds) {
            this.endGame(io)
        } else if (currentRound < this.rounds) {
            console.log('\x1b[31m\x1b[47m%s\x1b[0m', `ОТПРАВКА ТРЕКА (${currentRound + 1}) в ${this.roomId}`)
            console.log(this.tracks[currentRound])

            io.in(this.roomId).emit('trackUpdate', this.tracks[currentRound].preview)
            setTimeout(() => this.newRound(io, currentRound + 1), 30000)
        }
    }

    endGame (io) {
        this.isGameStarted = false
        this.tracks = []
        console.log('GAME ENDED IN: ', this)
        io.in(this.roomId).emit('gameEnded')
    }
}

module.exports = function (server, spotify) {
    const io = require('socket.io').listen(server)

    async function getTracks (userId, playlistId) {
        const user = spotify.users.find(user => user.id === userId)
        const params = 'fields=items(track(album(images)%2C%20artists%2C%20name%2C%20preview_url))'
        const tracks = await spotify.request(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?${params}`, user)

        return tracks.items
            .filter(item => item.track.preview_url !== null)
            .map(item => {
                return {
                    name: item.track.name,
                    artist: item.track.artists[0].name,
                    image: item.track.album.images[0].url,
                    preview: item.track.preview_url
                }
            })
    }

    io.on('connection', (socket) => {
        socket.on('isUserLogin', (userId, response) => {
            const user = spotify.users.find(user => user.id === userId)

            if (user) {
                return response('ok')
            } else {
                return response(null)
            }
        })

        socket.on('createRoom', (name) => {
            const roomId = generators.generateRoomId(rooms)

            socket.join(roomId)

            const room = new Room(roomId)
            room.setLeader(socket.id)
            room.addPlayer(socket.id, name)
            rooms.set(roomId, room)

            socket.emit('roomCreated', roomId)
            socket.emit('playersUpdate', room.players.connected)

            console.log('\x1b[32m%s\x1b[0m', 'ROOM CREATED:')
            console.log(room)
        })

        socket.on('addPlayer', (roomId, name, response) => {
            const room = rooms.get(roomId)

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

            room.addPlayer(socket.id, name)

            console.log('\x1b[32m%s\x1b[0m', 'PLAYER ADDED:', 'Room ID: ', room.roomId)
            console.log('Players: ', room.players.connected)

            socket.join(roomId)
            io.in(roomId).emit('playersUpdate', room.players.connected)

            return response({
                status: 'ok'
            })
        })

        socket.on('changePlaylistImage', (roomId, image) => {
            socket.to(roomId).emit('changePlaylistImage', image)
        })

        socket.on('startGame', async (roomId, userId, playlistId) => {
            const room = rooms.get(roomId)

            if (room.players.leaderId === socket.id) {
                const tracks = await getTracks(userId, playlistId)
                const trackSet = new Set()
                while (trackSet.size !== 10) {
                    trackSet.add(Math.floor(Math.random() * tracks.length))
                }

                room.tracks = Array.from(trackSet).map(index => tracks[index])

                console.log('\x1b[31m\x1b[47m%s\x1b[0m', 'ОТПРАВКА СОБЫТИЯ НАЧАЛА ИГРЫ В ' + roomId)
                socket.to(roomId).emit('gameStarted')
                setTimeout(() => room.startGame(io), 1000)
            }
        })
    })
}
