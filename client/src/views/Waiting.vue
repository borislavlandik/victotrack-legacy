<template>
<div class="content-waiting">
    <div class="audio-block">
        <img class="curPlaylist" :src="currentPlaylist" alt="Playlist Image">
        <div class="sqrBar">
            <button @click="goHome" class="card sqr button hide-on-desktop">
                <img class="icons" alt="home" src="..\assets\images\icons\home.svg" draggable="false">
            </button>
        </div>
    </div>

    <div class="info-block waiting-info hide-on-mobile">
        <button @click="goHome" class="card button">
            На главную
        </button>
        <div class="card waiting-info__room">
            <h3>Игрок: {{name}}</h3>
            <h3>Комната: {{room}}</h3>
        </div>
        <div class="card waiting-info__players" v-if="opponents.length > 0">
            <ul class="players">
                <li>Соперники:</li>
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
        },
        roomClear () {
            this.$router.push('/')
        }
    },
    methods: {
        goHome () {
            this.$socket.client.emit('removePlayer', this.$store.state.room)
            this.$router.push('/')
        }
    },
    computed: {
        currentPlaylist () {
            return this.$store.state.currentPlaylist.image
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

<style lang="scss">
.content-waiting {
    display: flex;
}

.audio-block {
    display: flex;
}

@include _480 {
    .audio-block {
        width: 100%;
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .content-waiting {
        display: block;

        .waiting-info {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 100%;

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

            &__players.card {
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

            .button {
                display: none;
            }
        }
    }
    }
</style>
