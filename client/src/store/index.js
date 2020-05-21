import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        selectedPlaylistIndex: null,
        room: null,
        players: []
    },
    mutations: {
        changePlaylistIndex (state, index) {
            state.selectedPlaylistIndex = index
        },
        SOCKET_roomCreated (state, roomId) {
            state.room = roomId
        },
        SOCKET_playersUpdate (state, players) {
            state.players = players
        }
    }
})
