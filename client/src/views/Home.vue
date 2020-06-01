<template>
<div class="container">
    <div class="content-home">
        <header class="header">
            <h1 class="header__title">Угадай мелодию</h1>
            <p class="header__subtitle">Сможете ли вы угадать все мелодии?</p>
        </header>
        <div class="modes">
            <div class="mode">
                <h3 class="mode__title">Создать комнату</h3>
                <a :href="serverUrl + '/login'" class="button">Продолжить со Spotify</a>
            </div>
            <div class="mode">
                <h3 class="mode__title">Войти в комнату</h3>
                <input class="input-text centered" type="text" placeholder="Введите код" v-model="roomId">
            </div>
        </div>
        <button @click="startGame" class="button centered">Начать игру</button>
    </div>
</div>
</template>

<script>
import Mixin from '@/mixin'

export default {
    mixins: [Mixin],
    data () {
        return {
            roomId: null
        }
    },
    methods: {
        startGame () {
            this.$socket.emit('addPlayer', this.roomId, (data) => {
                if (data.status === 'ok') {
                    this.$store.state.room = this.roomId
                    this.$router.push('waitingRoom')
                }
            })
        }
    }
}
</script>
