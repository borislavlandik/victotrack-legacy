<template>
    <div class="content-home">
        <aside class="main-menu">
            <div class="main-menu__element">
                <div class="card" :class="{'shake': required}">
                    <input class="input-text" type="text" placeholder="Ваше имя" :value="name" @input="updateName">
                </div>
            </div>
            <div class="main-menu__element">
                <div class="join-room">
                    <div class="card button">
                        <input class="input-text" type="text" placeholder="Войти в комнату" v-model="roomId">
                    </div>
                    <transition name="fade-right">
                        <button class="card button button--image button--left-offset" @click="startGame" v-show="roomId">
                            <img alt="->" src="..\assets\images\icons\arrow.svg" draggable="false">
                        </button>
                    </transition>
                </div>
            </div>
            <div class="main-menu__element">
                <button class="card button" @click="createRoom" @mouseover="show = true" @mouseleave="show = false"><h3>Создать комнату</h3></button>
                <transition name="fade-right">
                    <h3 class="white-h3" v-show="show">Используя Spotify</h3>
                </transition>
            </div>
        </aside>
    </div>
</template>

<script>
import Mixin from '@/mixin'
import { mapState } from 'vuex'

export default {
    mixins: [Mixin],
    data () {
        return {
            roomId: null,
            show: false,
            required: false
        }
    },
    computed: {
        ...mapState({
            name: state => state.name
        })
    },
    methods: {
        startGame () {
            this.$socket.emit('addPlayer', this.roomId, this.name, data => {
                if (data.status === 'ok') {
                    this.$store.state.room = this.roomId
                    this.$router.push('waiting')
                }
            })
        },
        createRoom () {
            if (!this.name) {
                this.required = true
                setTimeout(() => { this.required = false }, 300)
                return
            }

            this.required = false

            this.$socket.emit('isUserLogin', status => {
                if (status === 'ok') {
                    this.$router.push('selection')
                } else {
                    window.location.href = this.serverUrl + '/login'
                }
            })
        },
        updateName (event) {
            this.$store.commit('set', { key: 'name', value: event.target.value })
        }
    }
}
</script>

<style lang="scss">
    .content-home {
       // .main-menu {
       //     &__element {
      //         margin-bottom: 20px;это свойство теперь в _card.scss
       //       }
      //   }

        .join-room {
            // margin-top: 20px;   это свойство теперь в _card.scss
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .white-h3 {
            display: inline-block;
            margin-left: 20px;
            color: #FFFFFF;
            text-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
        }
    }
</style>
