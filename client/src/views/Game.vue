<template>
<!--<div class="container">
    <div class="content-game">
        <div class="audio_block">
            <audio ref="audio" :src="track" autoplay></audio>
        </div>
        <div class="card audio_block">
            <input class="input-text" type="text" placeholder="Артист, трек" v-model="artistId">
        </div>

        <div class="gamer">
            <button @click="goHome" class="button">На главную</button>
        </div>
        <div class="card gamer">
            <h3>Игрок:</h3>
            <h3>Комната:</h3>
        </div>
        <div class="card gamer">
            <h3>Соперники:</h3>
        </div>
    </div>
</div>-->

<div class="container">
    <div class="content-game">
        <div class="audio_block">
            <audio ref="audio" :src="track" autoplay></audio>
            <div class="send ans">
                <div class="card button">
                    <input class="input-text" type="text" placeholder="Артист, трек" v-model="answer">
                </div>
                <transition name="fade-right">
                    <button class="card button button--image button--left-offset" v-show="answer">
                        <img alt="->" src="..\assets\images\icons\arrow.svg" draggable="false">
                    </button>
                </transition>
            </div>
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
    data () {
        return {
            answer: null
        }
    },
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
