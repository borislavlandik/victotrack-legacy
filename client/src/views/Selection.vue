<template>
    <div class="content-selection">
        <div class="game-data">
            <div class="card game-data__room">
                <h3>Игрок: {{name}}</h3>
                <h3>Комната: {{room}}</h3>
            </div>
            <div class="card game-data__players">
                <h3>Соперники:</h3>
                <ul class="players">
                    <li v-for="(opponent, index) in opponents" :key="index">{{opponent.name}}</li>
                </ul>
            </div>
        </div>

        <playlist-slider :playlists="playlists"></playlist-slider>

        <div class="selection-menu">
            <button @click="goHome" class="card button">На главную</button>
            <div class="playlist-nav">
                <div class="playlist-prev-btn">
                    <button class="card button">
                        <img alt="&#60;" src="..\assets\images\icons\toleft.svg" draggable="false">
                    </button>
                </div>
                <div class="playlist-next-btn">
                    <button class="card button">
                        <img alt="&#62;" src="..\assets\images\icons\toright.svg" draggable="false">
                    </button>
                </div>
            </div>
            <button @click="startGame" class="card button">Начать игру</button>
        </div>
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
        },
        name () {
            return this.$store.state.name
        },
        opponents () {
            return this.$store.getters.opponents
        }
    },
    created () {
        if (Cookies.get('user_id')) {
            this.$socket.emit('createRoom', this.name)
        } else {
            this.$router.push('/')
        }
    },
    async mounted () {
        this.playlists = await Spotify.getPlaylists()
        console.log(this.playlists)
    },
    methods: {
        startGame () {
            if (this.$store.state.selectedPlaylist) {
                this.$socket.emit('startGame', this.room, this.$store.state.selectedPlaylist)
                this.$router.push('game')
            }
        },
        goHome () {
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss">
.content-selection {
    position: relative;
}

.game-data {
    display: flex;
    position: absolute;
    top: -100px;
    right: 0;
    align-items: flex-start;

    &__room {
        margin-right: 20px;
    }
}

.selection-menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.playlist-nav {
    display: flex;
    flex-direction: row;

    .playlist-prev-btn {
        margin-right: 50px;
    }
}
</style>
