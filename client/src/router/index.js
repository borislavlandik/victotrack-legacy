import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Selection from '../views/Selection.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/selection',
        name: 'Select Playlist',
        component: Selection
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
