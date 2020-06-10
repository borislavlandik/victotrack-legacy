const generators = require('../services/generators')

const rooms = new Map()

class Player {
    constructor (id, name) {
        this.clientId = Buffer.from(`${id}:+:${name}`).toString('base64')
        this.name = name
        this.scores = 0
        this.isReady = false
    }
}

class Room {
    constructor (id) {
        this.roomId = id
        this.isGameStarted = false
        this.rounds = 10
        this.players = new Map()
        this.tracks = []
        this.currentPlaylist = {
            name: null,
            image: 'https://baconmockup.com/250/250'
        }
    }

    setLeader (id) {
        this.leaderId = id
    }

    createPlayer (id, name) {
        const player = new Player(id, name)
        this.players.set(id, player)
        return player
    }

    tryStart (io) {
        if ([...this.players.values()].every(player => player.isReady)) {
            this.startGame(io)
        }
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

        if (!this.isGameStarted || player === undefined) {
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
        this.currentPlaylist = {
            name: null,
            image: 'https://baconmockup.com/250/250'
        }

        this.players.forEach(player => {
            player.scores = 0
            player.isReady = false
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

            if (room === undefined || room.isGameStarted || room.players.size >= 4) {
                return response({
                    status: 'error'
                })
            }

            socket.emit('clientId', room.createPlayer(socket.id, name).clientId)
            socket.join(roomId)
            socket.emit('changePlaylist', room.currentPlaylist)
            io.in(roomId).emit('playersUpdate', [...room.players.values()])

            return response({
                status: 'ok'
            })
        })

        socket.on('changePlaylist', (roomId, playlist) => {
            rooms.get(roomId).currentPlaylist = playlist
            socket.to(roomId).emit('changePlaylist', playlist)
        })

        socket.on('playerReady', (roomId) => {
            const room = rooms.get(roomId)

            room.players.get(socket.id).isReady = true
            room.tryStart(io)
        })

        socket.on('startGame', async (roomId, userId, playlistId) => {
            const room = rooms.get(roomId)

            if (socket.id === room.leaderId) {
                let tracks = await getTracks(userId, playlistId)

                const clearTracks = tracks.map(track => {
                    return {
                        name: track.name,
                        artist: track.artist
                    }
                })

                const randomTracks = Array.from(clearTracks)

                for (let i = 0; i < clearTracks.length; i += Math.floor(Math.random() * 3 + 1)) {
                    const track = clearTracks[i]
                    const randomIndex = Math.floor(Math.random() * clearTracks.length)

                    if (Math.random() < 0.5) {
                        const randomTrack = clearTracks.find((t, ind) => t.name !== track.name && ind >= randomIndex)

                        if (randomTrack !== undefined && track.artist !== randomTrack.artist) {
                            console.log('ДОБАВЛЕНИЕ: ', track.artist, randomTrack.name)
                            randomTracks.push({
                                artist: track.artist,
                                name: randomTrack.name
                            })
                        }
                    } else {
                        const randomTrack = clearTracks.find((t, ind) => t.artist !== track.artist && ind >= randomIndex)

                        if (randomTrack !== undefined && track.name !== randomTrack.name) {
                            console.log('ДОБАВЛЕНИЕ: ', randomTrack.artist, track.name)
                            randomTracks.push({
                                artist: randomTrack.artist,
                                name: track.name
                            })
                        }
                    }
                }

                io.in(roomId).emit('tracks', randomTracks)

                tracks = tracks.filter(track => track.preview != null)
                const trackSet = new Set()
                while (trackSet.size !== 10) {
                    trackSet.add(Math.floor(Math.random() * tracks.length))
                }

                room.tracks = Array.from(trackSet).map(index => tracks[index])

                socket.to(roomId).emit('gameStarted')
                room.players.get(socket.id).isReady = true
                room.tryStart(io)
            }
        })

        socket.on('checkAnswer', (roomId, answer) => {
            rooms.get(roomId).checkAnswer(io, socket.id, answer)
        })

        socket.on('restartRoom', (roomId, response) => {
            const room = rooms.get(roomId)

            if (room === undefined) {
                return
            }

            if (socket.id === room.leaderId) {
                room.resetRoom()
                console.log('ROOM : ', room)
                socket.in(roomId).emit('resetRoom')
                return response('leader')
            } else {
                return response('player')
            }
        })

        socket.on('removeRoom', (roomId) => {
            removeRoom(socket.id, roomId)
        })

        socket.on('removePlayer', (roomId) => {
            const room = rooms.get(roomId)

            if (room === undefined) {
                return
            }

            room.players.delete(socket.id)
            socket.leave(roomId)

            if (room.players.size === 0) {
                removeRoom(room.leaderId, roomId)
            }

            io.in(roomId).emit('playersUpdate', [...room.players.values()])
        })

        function removeRoom (playerId, roomId) {
            const room = rooms.get(roomId)

            if (room === undefined) {
                return
            }

            if (playerId === room.leaderId) {
                room.players.forEach((player, id) => {
                    const currentSocket = io.sockets.connected[id]
                    if (currentSocket) {
                        currentSocket.leave(roomId)
                    }
                })
                io.to(roomId).emit('roomClear')
                rooms.delete(roomId)
            } else {
                room.players.delete(socket.id)
                io.in(roomId).emit('playersUpdate', [...room.players.values()])
            }
        }
    })
}
