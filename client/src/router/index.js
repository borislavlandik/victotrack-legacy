import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Selection from '../views/Selection.vue'
import Game from '../views/Game.vue'
import Waiting from '../views/Waiting.vue'
import Fin from '../views/Fin.vue'
import Redirect from '../views/Redirect.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: 'Виктотрек'
        }
    },
    {
        path: '/selection',
        name: 'selection',
        component: Selection,
        meta: {
            title: 'Выбираем'
        }
    },
    {
        path: '/game',
        name: 'game',
        component: Game,
        meta: {
            title: 'Играем'
        }
    },
    {
        path: '/waiting',
        name: 'waiting',
        component: Waiting,
        meta: {
            title: 'Ожидание'
        }
    },
    {
        path: '/fin',
        name: 'fin',
        component: Fin,
        meta: {
            title: 'Окончание'
        }
    },
    {
        path: '/redirect/:method',
        name: 'redirect',
        component: Redirect,
        meta: {
            title: 'Перенаправление'
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    Vue.nextTick(() => {
        document.title = to.meta.title
    })

    next()
})

export default router
