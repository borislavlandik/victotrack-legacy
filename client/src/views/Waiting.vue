<template>
<div class="content-game">
    <div class="audio_block">
            <!--TODO: Место под обложку текущего плейлиста,
                        если еще не выбран, нужна заглушка-->
        <img class="curPlaylist" :src="currentPlaylist" alt="Playlist Image">
    </div>

    <div class="info-block">
        <button @click="goHome" class="card button">
            <h3>На главную</h3>
        </button>
        <div class="card">
            <h3>Игрок: {{name}}</h3>
            <h3>Комната: {{room}}</h3>
        </div>
        <div class="card">
            <h3>Соперники:</h3>
            <ul class="players">
                <li v-for="(opponent, index) in opponents" :key="index">{{opponent.name}}</li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
export default {
    sockets: {
        gameStarted () {
            this.$router.push('game')
        }
    },
    methods: {
        goHome () {
            this.$router.push('/')
        }
    },
    computed: {
        currentPlaylist () {
            return this.$store.state.playlistImage
        },
        room () {
            return this.$store.state.room
        },
        name () {
            return this.$store.state.name
        },
        opponents () {
            return this.$store.getters.opponents
        }
    }
}
</script>
