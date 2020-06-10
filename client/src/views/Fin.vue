<template>
<div class="content-game">
    <div class="game-zone">
        <div class="album-timer">
            <img class="curPlaylist" :src="currentPlaylist" alt="Playlist Image">
             <div class="sqrBar hide-on-desktop">
                <button @click="goHome" class="card sqr button hide-on-desktop">
                    <img class="icons" alt="home" src="..\assets\images\icons\home.svg" draggable="false">
                </button>
                <button @click="goGame" class="card sqr button hide-on-desktop">
                    <img class="icons" alt="restart" src="..\assets\images\icons\restart.svg" draggable="false">
                </button>
            </div>
        </div>
        <div class="results">
            <div class="card" v-if="scores && scores.length > 1 && scores[0].score !== scores[1].score">
                <h3 id="this-text-center" class="text-center" data-style="center">Победитель - {{winner.name}}</h3>
            </div>
            <div class="card">
                <table class="score-table">
                    <tr v-for="(score, index) in scores" :key="index">
                        <td>{{score.score}} {{getScores(score.score)}}</td>
                        <td class="th-right">{{score.name}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div class="info-block">
        <button @click="goHome" class="card button">
            <h3>На главную</h3>
        </button>

        <button @click="goGame" class="card button">
            <h3>Сыграть ещё</h3>
        </button>
    </div>
</div>
</template>

<script>
export default {
    sockets: {
        resetRoom () {
            this.$router.push('waiting')
        }
    },
    computed: {
        currentPlaylist () {
            return this.$store.state.currentPlaylist.image
        },
        scores () {
            return this.$store.getters.sortedScores
        },
        winner () {
            return this.scores[0] || ''
        }
    },
    methods: {
        goHome () {
            this.$socket.client.emit('removeRoom', this.$store.state.room)
            this.$router.push('/')
            this.$store.dispatch('resetState')
        },
        goGame () {
            this.$socket.client.emit('restartRoom', this.$store.state.room, response => {
                if (response === 'leader') {
                    localStorage.setItem('roomAction', 'save')
                    this.$router.push('selection')
                } else if (response === 'player') {
                    this.$router.push('waiting')
                }
            })
        },
        getScores (n) {
            n = Math.abs(n) % 100
            const n1 = n % 10
            if (n > 10 && n < 20) { return 'баллов' }
            if (n1 > 1 && n1 < 5) { return 'балла' }
            if (n1 === 1) { return 'балл' }
            return 'баллов'
        }
    }
}
</script>

<style lang="scss">
    .score-table {
        width: 100%;
    }

    .th-right{
        text-align:right;
        margin-left:auto;
    }

    #this-text-center.text-center[data-style="center"] {
        text-align: center;
    }
</style>
