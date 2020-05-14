import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        selectedPlaylistIndex: null
    },
    mutations: {
        changePlaylistIndex (state, index) {
            state.selectedPlaylistIndex = index
        }
    }
})
