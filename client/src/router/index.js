import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Selection from '../views/Selection.vue'
import Game from '../views/Game.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/selection',
        name: 'selection',
        component: Selection
    },
    {
        path: '/game',
        name: 'game',
        component: Game
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
