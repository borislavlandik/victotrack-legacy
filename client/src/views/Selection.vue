<template>
    <div class="content-selection">
        <div class="selection-text">
           <div class="card"><h2 class="selection__header">Комната: {{room}}</h2></div>
        </div>
        <playlist-slider :playlists="playlists"></playlist-slider>

        <button @click="startGame" class="button centered">
            <div class="card">  Начать игру  </div>
        </button>

    </div>
</template>

<script>
import PlaylistSlider from '@/components/PlaylistSlider'
import Spotify from '@/services/spotify'
import Cookies from 'js-cookie'

export default {
    components: {
        PlaylistSlider
    },
    data () {
        return {
            playlists: []
        }
    },
    computed: {
        room () {
            return this.$store.state.room
        }
    },
    created () {
        if (this.$store.state.room === null && Cookies.get('user_id')) {
            this.$socket.emit('createRoom', 'Leader Name')
        } else {
            this.$router.push('/')
        }
    },
    async mounted () {
        this.playlists = await Spotify.getPlaylists()
    },
    methods: {
        startGame () {
            if (this.$store.state.selectedPlaylist) {
                this.$socket.emit('startGame', this.room, this.$store.state.selectedPlaylist)
                this.$router.push('game')
            }
        }
    }
}
</script>
