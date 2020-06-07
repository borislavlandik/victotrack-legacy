import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        urls: {
            serverUrl: 'http://localhost:3000',
            loginUrl: 'http://localhost:3000/login',
            homeUrl: 'http://localhost:8080'
        },
        name: Cookie.get('name') || null,
        room: null,
        selectedPlaylist: null,
        playlistImage: 'https://baconmockup.com/250/250',
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
        socket_roomCreated ({ commit }, roomId) {
            commit('set', { key: 'room', value: roomId })
        },
        socket_playersUpdate ({ commit }, players) {
            commit('set', { key: 'players', value: players })
        },
        socket_changePlaylistImage ({ commit }, image) {
            commit('set', { key: 'playlistImage', value: image })
        }
    }
})
