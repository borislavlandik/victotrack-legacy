import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIoExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

const socket = io(store.state.urls.serverUrl)

Vue.config.productionTip = false
Vue.use(VueSocketIoExt, socket, { store })

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
