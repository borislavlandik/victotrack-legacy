module.exports = {
    generateId (prefix) {
        if (prefix === undefined) {
            throw new Error('prefix is required')
        }

        return `${prefix}${(+new Date()).toString(16)}`
    },
    generateRoomId (rooms) {
        const roomIds = rooms.map(room => room.roomId)

        let roomId
        while (true) {
            roomId = Math.floor(Math.random() * 1000000)

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
