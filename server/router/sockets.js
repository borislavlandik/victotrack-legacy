const generators = require('../services/generators')

const rooms = []

module.exports = function (server) {
    const io = require('socket.io').listen(server)

    io.on('connection', (socket) => {
        socket.on('createRoom', (playerName) => {
            const roomId = generators.generateRoomId(rooms)

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
                playlist: null,
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
    })
}
