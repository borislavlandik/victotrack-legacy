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
        clientId: null,
        room: null,
        selectedPlaylist: null,
        currentPlaylist: {
            id: 'null',
            name: 'some name',
            image: 'https://baconmockup.com/250/250'
        },
        players: [],
        tracks: [],
        scores: []
    },
    getters: {
        opponents (state) {
            return state.players.filter(player => player.clientId !== state.clientId)
        },
        tracks (state) {
            let randomTracks = []

            randomTracks = state.tracks.map(track => {
                return {
                    name: track.name,
                    artist: track.artist
                }
            })

            return randomTracks
        },
        sortedScores (state) {
            const sorted = [...state.scores].sort((a, b) => b.score - a.score)
            console.log(sorted, [...state.scores])
            return sorted
        }
    },
    mutations: {
        set (state, { key, value }) {
            state[key] = value
        }
    },
    actions: {
        resetState ({ commit }) {
            commit('set', { key: 'selectedPlaylist', value: null })
            commit('set', {
                key: 'currentPlaylist',
                value: {
                    id: 'null',
                    name: 'some name',
                    image: 'https://baconmockup.com/250/250'
                }
            })
            commit('set', { key: 'players', value: [] })
            commit('set', { key: 'tracks', value: [] })
            commit('set', { key: 'scores', value: {} })
        },
        socket_clientId ({ commit }, clientId) {
            commit('set', { key: 'clientId', value: clientId })
        },
        socket_roomCreated ({ commit }, roomId) {
            commit('set', { key: 'room', value: roomId })
        },
        socket_playersUpdate ({ commit }, players) {
            commit('set', { key: 'players', value: players })
        },
        socket_changePlaylist ({ commit }, playlist) {
            commit('set', { key: 'currentPlaylist', value: playlist })
        },
        socket_tracks ({ commit }, tracks) {
            commit('set', { key: 'tracks', value: tracks })
        },
        socket_scores ({ commit }, scores) {
            commit('set', { key: 'scores', value: scores })
        }
    }
})
