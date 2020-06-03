<template>
<div class="container">
    <div class="content-game">
        <audio ref="audio" :src="track" controls autoplay></audio>
        <div class="card">
            <input class="input-text" type="text" placeholder="Артист, трек" v-model="artistId">
        </div>
        <button @click="goHome" class="button">
            <div class="card">На главную</div>
        </button>
        <div class="card gamer">
            <h3>Игрок:</h3>
        </div>
        <div class="card gamer">
            <h3>Комната:</h3>
        </div>
        <div class="card gamer">
            <h3>Соперники:</h3>
        </div>
    </div>
</div>
</template>

<script>
import Mixin from '@/mixin'

export default {
    mixins: [Mixin],
    computed: {
        track () {
            return this.$store.state.currentTrack
        }
    },
    mounted () {
        console.log(this.$refs.audio)
        this.$refs.audio.volume = 0.2
    },
    methods: {
        goHome () {
            this.$router.push('/')
        }
    }
}
</script>
