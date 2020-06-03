const generators = require('../services/generators')
// const fetch = require('node-fetch')
const names = ['Happy', 'Crazy', 'Jazzy', 'Funky', 'Sunny']

const rooms = []

function getRandomName () {
    return names[Math.floor(Math.random() * names.length)]
}

module.exports = function (server, spotify) {
    const io = require('socket.io').listen(server)

    io.on('connection', (socket) => {
        function getCookie (name) {
            const matches = socket.handshake.headers.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
            return matches ? decodeURIComponent(matches[1]) : undefined
        }

        async function getTracks (playlistId) {
            const userId = getCookie('user_id')
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

        socket.on('createRoom', () => {
            const roomId = generators.generateRoomId(rooms)

            socket.join(roomId)

            const room = {
                roomId: roomId,
                isGameStarted: false,
                players: {
                    leaderId: socket.id,
                    connected: [
                        {
                            name: getRandomName(),
                            id: socket.id
                        }
                    ]
                },
                tracks: []
            }
            rooms.push(room)

            socket.emit('roomCreated', roomId)
            socket.emit('playersUpdate', room.players.connected)

            console.log('\x1b[32m%s\x1b[0m', 'ROOM CREATED:', 'Room ID: ', room.roomId)
            console.log('Players: ', room.players.connected)
        })

        socket.on('addPlayer', (roomId, response) => {
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
                name: getRandomName(),
                id: socket.id
            })

            console.log('\x1b[32m%s\x1b[0m', 'PLAYER ADDED:', 'Room ID: ', room.roomId)
            console.log('Players: ', room.players.connected)

            socket.join(roomId)
            socket.to(roomId).broadcast.emit('playersUpdate', room.players.connected)

            return response({
                status: 'ok'
            })
        })

        socket.on('startGame', async (roomId, playlistId) => {
            const room = rooms.find(room => room.roomId === roomId)

            if (room.players.leaderId === socket.id) {
                console.log('Игра начата от имени лидера')

                const tracks = await getTracks(playlistId)
                const trackSet = new Set()
                while (trackSet.size !== 10) {
                    trackSet.add(Math.floor(Math.random() * tracks.length))
                }

                room.tracks = Array.from(trackSet).map(index => tracks[index])
                console.log(room.tracks)

                setTimeout(game, 1000, room, 0)
            }
        })

        function game (room, index) {
            if (index < 10) {
                socket.emit('trackUpdate', room.tracks[index].preview)
                setTimeout(game, 1000, room, index + 1)
            }
        }
    })
}
