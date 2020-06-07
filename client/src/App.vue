<template>
    <div id="app">
        <div class="background-image">
            <img alt="background" :src="randomImage">
        </div>
        <div class="container">
            <transition name="fade" mode="out-in">
                <header class="header" :key="title">
                    <h1 class="header__title">{{title}}</h1>
                </header>
            </transition>
            <transition name="fade" mode="out-in">
                <router-view/>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        title () {
            return this.$route.meta.title
        },
        randomImage () {
            return require(`./assets/images/backgrounds/background (${Math.floor(Math.random() * 15 + 1)}).png`)
        }
    }
}
</script>

<style lang="scss">
#app {
    height: 100vh;
    color: $text-color;
}

.background-image {
    position: absolute;
    left: 0;
    right: 0;
    z-index: -1;

    & img {
        height: 100vh;
        width: 100vw;
        object-fit: cover;
        vertical-align: middle;
    }
}

.header {
    margin-bottom: 30px;
    padding-top: 30px;
    z-index: 1;

    &__title {
        color: #FFFFFF;
        font-size: 5em;
        text-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
    }
}
@media (max-width: 480px) {
    .background-image{
        position: absolute;
        left: 0;
        right: 0;
        z-index: -1;

        & img {
            height: 100vh;
            width: 100vw;
            object-fit: cover;
            vertical-align: middle;
        }
    }
    .header {
        &__title {
                font-size: 2.4em;
            }
    }
    #app {
        height: 100vh;
        color: $text-color;
    }
}
</style>
