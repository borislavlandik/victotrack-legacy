module.exports = {
    generateRoomId (rooms) {
        const roomIds = rooms.map(room => room.roomId)

        let roomId
        while (true) {
            roomId = Math.floor(Math.random() * 9000 + 1000)

            if (roomIds.every(id => roomId !== id)) {
                break
            }
        }

        return roomId.toString()
    },
    generateState (length) {
        let state = ''
        const possibleChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrtsuvwxyz'

        for (let i = 0; i < length; i++) {
            state += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
        }

        return state
    }
}
