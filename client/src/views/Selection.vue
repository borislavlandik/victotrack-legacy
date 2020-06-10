<template>
    <div class="content-selection">
        <div class="game-data">
            <div class="card game-data__room">
                <h3>Игрок: {{name}}</h3>
                <h3>Комната: {{room}}</h3>
            </div>
            <div class="card game-data__players" v-if="opponents.length > 0">
                <ul class="players">
                    <li>Соперники:</li>
                    <li v-for="(opponent, index) in opponents" :key="index">{{opponent.name}}</li>
                </ul>
            </div>
        </div>

        <playlist-slider @changePlaylist="playlistChanged" :playlists="playlists"></playlist-slider>

        <div class="selection-menu">
            <button @click="goHome" class="card button">На главную</button>
            <div class="playlist-nav">
                <div class="playlist-prev-btn">
                    <button class="card button sqr">
                        <img class="icons" alt="&#60;" src="..\assets\images\icons\toleft.svg" draggable="false">
                    </button>
                </div>
                <div class="playlist-next-btn">
                    <button class="card button sqr">
                        <img class="icons" alt="&#62;" src="..\assets\images\icons\toright.svg" draggable="false">
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
        const roomAction = localStorage.getItem('roomAction')
        if (Cookies.get('user_id') && roomAction === 'create') {
            this.$socket.client.emit('createRoom', this.name)
        } else if (roomAction === 'save') {
            // сохранение
        } else {
            this.$router.push('/')
        }

        localStorage.removeItem('roomAction')
    },
    async mounted () {
        this.playlists = await Spotify.getPlaylists()
    },
    methods: {
        startGame () {
            if (this.$store.state.selectedPlaylist) {
                this.$socket.client.emit('startGame', this.room, Cookies.get('user_id'), this.$store.state.selectedPlaylist)
                this.$router.push('game')
            }
        },
        goHome () {
            this.$socket.client.emit('removeRoom', this.$store.state.room)
            this.$router.push('/')
        },
        playlistChanged (index) {
            const currentPlaylist = this.playlists[index]
            if (currentPlaylist === undefined) {
                console.error('PLAYLIST ERROR: ', currentPlaylist, this.playlists, index)
            }
            this.$store.commit('set', { key: 'selectedPlaylist', value: currentPlaylist.id })
            this.$store.commit('set', { key: 'currentPlaylist', value: currentPlaylist })
            this.$socket.client.emit('changePlaylist', this.room, currentPlaylist)
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

@include _480 {
    .game-data{
        display: flex;
        position: relative;
        top: auto;
        align-items: flex-start;

        &__room.card {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            margin-right: 0;
        }

        &__players {
            position: absolute;
            top: 330px;
            width: 100%;
            ul {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;

                li {
                    width: 50%;

                    &:nth-child(2n) {
                        text-align: right;
                    }
                }
            }
        }
    }

    .selection-menu {
        position: relative;
        top: 100px;

        .button {
            width: 45%;
        }
    }

    .playlist-nav {
        .playlist-prev-btn, .playlist-next-btn {
            display: none;
        }
    }
}
</style>
