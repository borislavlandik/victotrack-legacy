<template>
    <div class="content-home">
        <div>
            <div class="card">
                <input class="input-text" type="text" placeholder="Ваше имя" v-model="nameId">
            </div>
            <br/>
            <div class="some-shit">
                <div class="card">
                    <input class="input-text" type="text" placeholder="Войти в комнату" v-model="roomId">
                </div>
                <button class="button arrow" @click="startGame">
                    <div class="card arrow">
                        <img alt="->" src="..\assets\images\icons\arrow.svg" draggable="false">
                    </div>
                </button>
            </div>
            <br/>
            <button class="button" @click="createRoom">
                <div class="card">Создать комнату</div>
            </button>
            <h3 class="white-h3">Используя Spotify</h3>
        </div>
    </div>
</template>

<script>
import Mixin from '@/mixin'
// import Cookies from 'js-cookie'

export default {
    mixins: [Mixin],
    data () {
        return {
            roomId: null,
            nameId: null
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
        },
        createRoom () {
            window.location.href = this.serverUrl + '/login'

            // if (Cookies.get('user_id')) {
            //     this.$router.push('/selection')
            // } else {
            // }
        }
    }
}
</script>
