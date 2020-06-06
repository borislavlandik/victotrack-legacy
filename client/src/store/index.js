import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        urls: {
            loginUrl: 'http://localhost:3000/login',
            homeUrl: 'http://localhost:8080'
        },
        name: Cookie.get('name') || null,
        room: null,
        selectedPlaylist: null,
        playlistImage: 'https://baconmockup.com/250/250',
        currentTrack: null,
        isGameStarted: false,
        players: []
    },
    getters: {
        opponents (state) {
            return state.players.filter(player => player.name !== state.name)
        }
    },
    mutations: {
        set (state, { key, value }) {
            state[key] = value
        }
    },
    actions: {
        SOCKET_roomCreated ({ commit }, roomId) {
            commit('set', { key: 'room', value: roomId })
        },
        SOCKET_playersUpdate ({ commit }, players) {
            commit('set', { key: 'players', value: players })
        },
        SOCKET_changePlaylistImage ({ commit }, image) {
            commit('set', { key: 'playlistImage', value: image })
        },
        SOCKET_gameStarted ({ commit }, data) {
            console.log('FROM VUEX: ', data)
            commit('set', { key: 'isGameStarted', value: true })
        },
        SOCKET_trackUpdate ({ commit }, track) {
            commit('set', { key: 'currentTrack', value: track })
        }
    }
})
