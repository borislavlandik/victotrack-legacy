<template>
    <div class="content-home">
        <aside class="main-menu">
            <div class="main-menu__element">
                <div class="card" :class="{'shake': requiredName}">
                    <input class="input-text" type="text" placeholder="Ваше имя" :value="name" @input="updateName" spellcheck="false">
                </div>
            </div>
            <div class="main-menu__element">
                <div class="join-room">
                    <div class="card smooth-width" :class="{'shake': invalidRoom}">
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
                <button class="card button stretch show-next" @click="createRoom">
                    Создать комнату
                </button>
                <h3 class="white-h3 show">Используя Spotify</h3>
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
            requiredName: false,
            invalidRoom: false,
            isLogin: false
        }
    },
    computed: {
        ...mapState({
            name: state => state.name
        })
    },
    mounted () {
        localStorage.removeItem('redirect')

        if (!Cookie.get('user_id')) {
            return
        }

        this.$socket.client.emit('isUserLogin', Cookie.get('user_id'), status => {
            if (status === 'ok') {
                this.isLogin = true
            } else {
                const storageEvent = () => {
                    if (localStorage.getItem('redirect') === 'ok') {
                        localStorage.removeItem('redirect')
                        window.removeEventListener('storage', storageEvent)
                        localStorage.setItem('roomAction', 'create')
                        this.$router.push('selection')
                    }
                }

                window.addEventListener('storage', storageEvent)
            }
        })
    },
    methods: {
        startGame () {
            if (!this.name) {
                this.requiredName = true
                setTimeout(() => { this.requiredName = false }, 300)
                return
            }

            Cookie.set('name', this.name, { sameSite: 'lax' })
            this.$socket.client.emit('addPlayer', this.roomId, this.name, data => {
                if (data.status === 'ok') {
                    this.$store.state.room = this.roomId
                    this.$router.push('waiting')
                } else {
                    this.invalidRoom = true
                    setTimeout(() => { this.invalidRoom = false }, 300)
                }
            })
        },
        createRoom () {
            if (!this.name) {
                this.requiredName = true
                setTimeout(() => { this.requiredName = false }, 300)
                return
            }

            Cookie.set('name', this.name, { sameSite: 'lax' })

            if (this.isLogin) {
                localStorage.setItem('roomAction', 'create')
                this.$router.push('selection')
            } else {
                window.open(this.$store.state.urls.homeUrl + '/redirect/login')
            }
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
        min-width: 70%;
        color: #FFFFFF;
        text-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
    }

    @include _600 {
        .show-next:hover + .show.white-h3, .show.white-h3 {
            display: none;
        }
    }

    @include _480 {
        .smooth-width {
            transition: all .3s linear;
        }

        .main-menu, .card, .input-text {
            width: 100%;
        }

        .float {
            display: inline-block;
            position: relative;
            margin-left: 20px;
        }
    }
}
</style>
