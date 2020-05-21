import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIo from 'vue-socket.io'

Vue.config.productionTip = false
Vue.use(new VueSocketIo({
    debug: false,
    connection: 'http://localhost:3000',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
