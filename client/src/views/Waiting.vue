<template>
<div class="container">
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
                <h3>Игрок:</h3>
                <h3>Комната:</h3>
            </div>
            <div class="card">
                <h3>Соперники:</h3>
            </div>
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
        }
    }
}
</script>
