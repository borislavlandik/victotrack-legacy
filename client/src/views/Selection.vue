<template>
    <div class="container">
        <div class="content-selection">
            <div class="selection-text">
                <h2 class="selection__header">Комната: {{room}}</h2>
                <p>Выберите плейлист для игры</p>
            </div>
            <playlist-slider :playlists="playlists"></playlist-slider>
            <button @click="startGame" class="button centered">Начать игру</button>
        </div>
    </div>
</template>

<script>
import PlaylistSlider from '@/components/PlaylistSlider'
import Spotify from '@/services/spotify'

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
        if (this.$store.state.room === null) {
            this.$socket.emit('createRoom', 'Leader Name')
        }
    },
    async mounted () {
        this.playlists = await Spotify.getPlaylists()
    },
    methods: {
        startGame () {
            if (this.$store.state.selectedPlaylistIndex !== null) {
                this.$router.push('game')
            }
        }
    }
}
</script>
