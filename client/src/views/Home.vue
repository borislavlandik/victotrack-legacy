<template>
    <div class="content-home">
        <aside class="main-menu">
            <div class="main-menu__element">
                <div class="card" :class="{'shake': required}">
                    <input class="input-text" type="text" placeholder="Ваше имя" :value="name" @input="updateName" spellcheck="false">
                </div>
            </div>
            <div class="main-menu__element">
                <div class="join-room">
                    <div class="card">
                        <input class="input-text" type="text" placeholder="Войти в комнату" v-model="roomId" @keypress.enter="startGame">
                    </div>
                    <transition name="fade-right">
                        <button class="card button sqr button--image button--left-offset float" @click="startGame" v-show="roomId">
                            <img class="icons" alt="->" src="..\assets\images\icons\arrow.svg" draggable="false">
                        </button>
                    </transition>
                </div>
            </div>
            <div class="main-menu__element">
                <button class="card button stretch"
                   @click="createRoom" @mouseover="show = true" @mouseleave="show = false">
                    Создать комнату
                </button>
                <transition name="fade-right">
                    <h3 class="white-h3" v-show="show">Используя Spotify</h3>
                </transition>
            </div>
        </aside>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Cookie from 'js-cookie'

export default {
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
            if (!this.name) {
                this.required = true
                setTimeout(() => { this.required = false }, 300)
                return
            }

            Cookie.set('name', this.name)
            this.$socket.client.emit('addPlayer', this.roomId, this.name, data => {
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

            Cookie.set('name', this.name)
            this.$socket.client.emit('isUserLogin', status => {
                if (status === 'ok') {
                    this.$router.push('selection')
                } else {
                    window.location.href = this.$store.state.urls.loginUrl
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
        display: flex;
        flex-direction: row;
        align-items: flex-end;

        .main-menu {
            display: inline-block;

            &__element {
                position: relative;
            }
        }

        .join-room {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
        }

        .float {
            display: inline-block;
            position: absolute;
            margin-left: calc(100% + 20px);
        }

        .white-h3 {
            display: inline-block;
            position: absolute;
            margin-top: 20px;
            margin-left: 20px;
            width: 100%;
            color: #FFFFFF;
            text-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
        }
    }
</style>
