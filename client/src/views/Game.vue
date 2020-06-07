<template>
<div class="content-game">
    <div class="game-zone">
        <div class="album-timer">
            <img class="curPlaylist" :src="currentPlaylist" alt="Playlist Image">
            <div class="card sqr">
                <h1 class="icons">{{currentTime}}</h1>
            </div>
        </div>
        <div class="input-zone">
            <div class="card" :class="{'shake': noInput}">
                <vue-autosuggest style="width: 420px"
                    v-model="answer"
                    :suggestions="filteredSuggestions"
                    :input-props="{ id:'autosuggest__input', placeholder:'Артист, трек' }"
                    :limit="3"
                    @input="inputAnswer" @selected="selected"
                    :should-render-suggestions="(size, loading) => size >= 0 && !loading && answer !== ''">
                    <template slot-scope="{suggestion}">
                        <div class="suggestion-item">{{suggestion.item.artist}} - {{suggestion.item.name}}</div>
                    </template>
                </vue-autosuggest>
            </div>
            <transition name="fade-right">
                <button class="card button sqr button--image button--left-offset" v-show="answer || score >= 0" @click="submitAnswer">
                    <img v-if="score === 0" class="icons" alt="X" src="..\assets\images\icons\cross.svg" draggable="false">
                    <img v-else-if="score === 1" class="icons" alt="->" src="..\assets\images\icons\check-mark.svg" draggable="false">
                    <img v-else-if="score === 2" class="icons" alt="->" src="..\assets\images\icons\check-marks.svg" draggable="false">
                    <img v-else class="icons" alt="->" src="..\assets\images\icons\arrow.svg" draggable="false">
                </button>
            </transition>
        </div>
    </div>

    <div class="info-block">
        <button @click="goHome" class="card button">
            <h3>На главную</h3>
        </button>
        <div class="card">
            <h3>Игрок: {{name}}</h3>
            <h3>Комната: {{room}}</h3>
        </div>
        <div class="card" v-if="opponents.length > 0">
            <h3>Соперники:</h3>
            <ul class="players">
                <li v-for="(opponent, index) in opponents" :key="index">{{opponent.name}}</li>
            </ul>
        </div>
    </div>

    <audio ref="audio" :src="currentTrack" autoplay></audio>
</div>
</template>

<script>
import { VueAutosuggest } from 'vue-autosuggest'

export default {
    sockets: {
        trackUpdate (track) {
            this.startTime()
            this.score = -1
            this.currentTrack = track
        },
        gameEnded () {
            this.$router.push('fin')
        },
        answerStatus (score) {
            this.score = score
        }
    },
    data () {
        return {
            answer: null,
            selectedAnswer: null,
            timer: null,
            currentTime: 29,
            currentTrack: null,
            noInput: false,
            score: -1,
            filteredSuggestions: []
        }
    },
    mounted () {
        this.$refs.audio.volume = 0.2
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
        },
        tracks () {
            return this.$store.getters.tracks
        }
    },
    methods: {
        goHome () {
            this.$socket.client.emit('removeRoom', this.$store.state.room)
            this.$router.push('/')
        },
        startTime () {
            this.currentTime = 29

            if (this.timer) {
                this.stopTimer()
            }

            this.timer = setInterval(() => {
                this.currentTime--
                if (this.currentTime === 0) {
                    this.stopTimer()
                }
            }, 1000)
        },
        stopTimer () {
            clearInterval(this.timer)
        },
        inputAnswer (text) {
            const keywords = text.toLowerCase().split(' ')
            const filteredSet = new Set()

            for (const track of this.tracks) {
                for (const keyword of keywords) {
                    if (track.name.toLowerCase().includes(keyword) || track.artist.toLowerCase().includes(keyword)) {
                        filteredSet.add(track)
                    }
                }

                if (filteredSet.size >= 3) {
                    break
                }
            }

            this.filteredSuggestions = [{
                data: Array.from(filteredSet).slice(0, 3)
            }]
        },
        selected (track) {
            this.selectedAnswer = {
                name: track.item.name,
                artist: track.item.artist
            }
            this.answer = `${track.item.artist} - ${track.item.name}`
        },
        submitAnswer () {
            if (this.selectedAnswer === null || this.answer.trim() === '' || this.score >= 0) {
                this.noInput = true
                setTimeout(() => { this.noInput = false }, 300)
            } else {
                this.$socket.client.emit('checkAnswer', this.room, this.selectedAnswer)
                this.answer = ''
                this.selectedAnswer = null
            }
        }
    },
    components: {
        VueAutosuggest
    }
}
</script>

<style lang="scss">
#autosuggest__input {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 2px solid #999999;
    border-radius: 2px;
}

.suggestion-item {
    margin: 10px 0;

    cursor: pointer;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:last-child {
        margin-bottom: 0;
    }
}
@media (max-width: 480px) {
    #autosuggest__input {
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
    }
}
</style>
