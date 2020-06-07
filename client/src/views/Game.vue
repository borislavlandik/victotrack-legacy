<template>
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

        <vue-autosuggest style="color: white"
            v-model="answer"
            :suggestions="filteredSuggestions"
            :input-props="{ id:'autosuggest__input', placeholder:'Артист, трек' }"
            :limit="3"
            @input="inputAnswer"
            :should-render-suggestions="(size, loading) => size >= 0 && !loading && answer !== ''">
            <template slot-scope="{suggestion}">
                <span class="my-suggestion-item">{{suggestion.item}}</span>
            </template>
        </vue-autosuggest>
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
            this.currentTrack = track
        },
        gameEnded () {
            this.$router.push('fin')
        }
    },
    data () {
        return {
            answer: null,
            timer: null,
            currentTime: 29,
            currentTrack: null,
            someSuggestions: [
                'Song1 - Some Artist 1',
                'Very Good Name For Song - Artist 2',
                'lorem - ipsum',
                'I like this song - But this artist shit',
                'So many suggestions feat. Black Hole - Star',
                'I don\'t know - What to say'
            ],
            filteredSuggestions: []
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
        },
        inputAnswer (text) {
            const filteredData = this.someSuggestions.filter(item => {
                return item.toLowerCase().indexOf(text.toLowerCase()) > -1
            }).slice(0, 3)

            this.filteredSuggestions = [{
                data: filteredData
            }]
        }
    },
    components: {
        VueAutosuggest
    }
}
</script>
