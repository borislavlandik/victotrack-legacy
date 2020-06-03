import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        selectedPlaylist: null,
        room: null,
        name: null,
        currentTrack: null,
        players: []
    },
    mutations: {
        set (state, { key, value }) {
            state[key] = value
        }
    },
    actions: {
        SOCKET_roomCreated ({ commit }, roomId, nameId) {
            commit('set', { key: 'room', value: roomId, nameId })
        },
        SOCKET_playersUpdate ({ commit }, players) {
            commit('set', { key: 'players', value: players })
        },
        SOCKET_trackUpdate ({ commit }, track) {
            commit('set', { key: 'currentTrack', value: track })
        }
    }
})
