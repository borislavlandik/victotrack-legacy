const generators = require('../services/generators')

const rooms = new Map()

class Player {
    #id
    constructor (id, name) {
        this.#id = id
        this.clientId = Buffer.from(`${id}:+:${name}`).toString('base64')
        this.name = name
        this.scores = 0
    }

    getId () {
        return this.#id
    }
}

class Room {
    constructor (id) {
        this.roomId = id
        this.isGameStarted = false
        this.rounds = 10
        this.players = new Map()
        this.tracks = []
    }

    setLeader (id) {
        this.leaderId = id
    }

    createPlayer (id, name) {
        const player = new Player(id, name)
        this.players.set(id, player)
        return player
    }

    startGame (io) {
        this.isGameStarted = true
        this.currentRound = 0
        this.newRound(io)
    }

    newRound (io) {
        if (this.currentRound === this.rounds) {
            this.endGame(io)
        } else if (this.currentRound < this.rounds) {
            io.in(this.roomId).emit('trackUpdate', this.tracks[this.currentRound].preview)

            setTimeout(() => {
                this.currentRound++
                this.newRound(io)
            }, 30000)
        }
    }

    endGame (io) {
        this.isGameStarted = false
        this.tracks = []

        io.in(this.roomId).emit('gameEnded')

        const scores = []
        this.players.forEach(player => {
            scores.push({
                name: player.name,
                score: player.scores
            })
        })

        scores.sort((a, b) => a.scores - b.scores)

        io.in(this.roomId).emit('scores', scores)
    }

    checkAnswer (io, id, answer) {
        const player = this.players.get(id)

        if (!this.isGameStarted || !player) {
            return
        }

        let scores = 0

        if (answer.name === this.tracks[this.currentRound].name) {
            scores++
        }

        if (answer.artist === this.tracks[this.currentRound].artist) {
            scores++
        }

        player.scores += scores
        io.to(id).emit('answerStatus', scores)
    }

    resetRoom (io) {
        this.players.forEach(player => {
            player.score = 0
        })
    }
}

module.exports = function (server, spotify) {
    const io = require('socket.io').listen(server)

    async function getTracks (userId, playlistId) {
        const user = spotify.users.find(user => user.id === userId)
        const params = 'fields=items(track(album(images)%2C%20artists%2C%20name%2C%20preview_url))'
        const tracks = await spotify.request(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?${params}`, user)

        return tracks.items
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
            socket.emit('clientId', room.createPlayer(socket.id, name).clientId)
            rooms.set(roomId, room)

            socket.emit('roomCreated', roomId)
            socket.emit('playersUpdate', [...room.players.values()])
        })

        socket.on('addPlayer', (roomId, name, response) => {
            const room = rooms.get(roomId)

            if (room === undefined || room.isGameStarted) {
                return response({
                    status: 'error'
                })
            }

            socket.emit('clientId', room.createPlayer(socket.id, name).clientId)

            socket.join(roomId)
            io.in(roomId).emit('playersUpdate', [...room.players.values()])

            return response({
                status: 'ok'
            })
        })

        socket.on('changePlaylistImage', (roomId, image) => {
            socket.to(roomId).emit('changePlaylistImage', image)
        })

        socket.on('startGame', async (roomId, userId, playlistId) => {
            const room = rooms.get(roomId)

            if (socket.id === room.leaderId) {
                let tracks = await getTracks(userId, playlistId)
                io.in(roomId).emit('tracks', tracks.map(track => {
                    return {
                        name: track.name,
                        artist: track.artist
                    }
                }))

                tracks = tracks.filter(track => track.preview != null)

                const trackSet = new Set()
                while (trackSet.size !== 10) {
                    trackSet.add(Math.floor(Math.random() * tracks.length))
                }

                room.tracks = Array.from(trackSet).map(index => tracks[index])

                socket.to(roomId).emit('gameStarted')
                setTimeout(() => room.startGame(io), 1000)
            }
        })

        socket.on('checkAnswer', (roomId, answer) => {
            rooms.get(roomId).checkAnswer(io, socket.id, answer)
        })

        socket.on('removeRoom', (roomId) => {
            const room = rooms.get(roomId)

            if (!room) {
                return
            }

            if (socket.id === room.leaderId) {
                room.players.forEach(player => {
                    io.sockets.connected[player.getId()].leave(roomId)
                })
                rooms.delete(roomId)
            } else {
                room.players.delete(socket.id)
                io.in(roomId).emit('playersUpdate', [...room.players.values()])
            }
        })

        socket.on('removePlayer', (roomId) => {
            const room = rooms.get(roomId)

            if (!room) {
                return
            }

            room.players.delete(socket.id)
            socket.leave(roomId)
            io.in(roomId).emit('playersUpdate', [...room.players.values()])
        })
    })
}
