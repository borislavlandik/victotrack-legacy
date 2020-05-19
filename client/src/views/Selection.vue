<template>
    <div class="container">
        <div class="content-selection">
            <div class="selection-text">
                <h2 class="selection__header">Комната: 293415</h2>
                <p>Выберите плейлист для игры</p>
            </div>
            <playlist-slider :playlists="playlists"></playlist-slider>
            <ul>
                <li v-for="player in players" :key="player.id">
                    {{player.name}}
                </li>
            </ul>
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
            playlists: [],
            players: []
        }
    },
    async mounted () {
        this.playlists = await Spotify.getPlaylists()
        this.$refs.audioPlayer.volume = 0.4
    },
    methods: {
        startGame () {
            console.log('Send "start" to server')
        }
    }
}
</script>
