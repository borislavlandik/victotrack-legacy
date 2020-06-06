<template>
<div class="container">
    <div class="content-game">
            <div class="game-zone">
                <div class="album-timer">
                    <img class="curPlaylist" :src="currentPlaylist" alt="Playlist Image">
                    <div class="card sqr">
                       <h1 class="icons">{{currentTime}}</h1>
                    </div>
                </div>
                <div class = "input-zone">
                    <div class="card">
                        <input class="input-text" type="text" placeholder="Артист, трек" v-model="answer">
                    </div>
                    <transition name="fade-right">
                        <button class="card button sqr button--image button--left-offset" v-show="answer">
                            <img class="icons" alt="->" src="..\assets\images\icons\arrow.svg" draggable="false">
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
<audio ref="audio" :src="track" autoplay></audio>
</div>
</template>

<script>
export default {
    sockets: {
        trackUpdate (track) {
            this.$store.commit('set', { key: 'currentTrack', value: track })
            this.startTime()
        }
    },
    data () {
        return {
            answer: null,
            timer: null,
            currentTime: 29
        }
    },
    computed: {
        track () {
            return this.$store.state.currentTrack
        },
        currentPlaylist () {
            return this.$store.state.playlistImage
        }
    },
    mounted () {
        this.$refs.audio.volume = 0.2
    },
    methods: {
        goHome () {
            this.$router.push('/')
        },
        startTime () {
            this.currentTime = 29

            this.timer = setInterval(() => {
                this.currentTime--
                if (this.currentTime === 0) {
                    this.stopTimer()
                }
            }, 1000)
        },
        stopTimer () {
            clearInterval(this.timer)
        }
    }
}
</script>
