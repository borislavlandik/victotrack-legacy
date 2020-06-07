<template>
<div class="content-game">
    <div class="results">
            <img class="curPlaylist" :src="currentPlaylist" alt="Playlist Image">
            <div class="card" v-if="scores && scores.length > 1 && scores[0].score !== scores[1].score">
                <h3>Победитель - {{winner.name}}</h3>
            </div>
            <div class="card">
                <table class="score-table">
                    <tr v-for="(score, index) in scores" :key="index">
                        <td>{{score.score}} б.</td>
                        <td class="th-right">{{score.name}}</td>
                    </tr>
                </table>
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
    computed: {
        currentPlaylist () {
            return this.$store.state.playlistImage
        },
        scores () {
            return this.$store.state.scores
        },
        winner () {
            return this.scores[0] || ''
        }
    },
    methods: {
        goHome () {
            this.$socket.client.emit('removeRoom', this.$store.state.room)
            this.$router.push('/')
        },
        goGame () {
            // TODO: использовать ту же комнату, что и была
            // TODO: для разных пользователей разные страницы (выбор или ожидание)
            this.$router.push('selection')
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
</style>
