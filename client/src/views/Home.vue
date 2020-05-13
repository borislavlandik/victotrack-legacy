<template>
<div class="container">
    <header class="header">
        <h1 class="header__title">Угадай мелодию</h1>
        <p class="header__subtitle">Сможете ли вы угадать все мелодии?</p>
    </header>
    <div class="content-home">
        <div class="modes">
            <div class="mode">
                <h3 class="mode__title">Создать комнату</h3>
                <button @click="say('Spotify')" class="button">Продолжить со Spotify</button>
            </div>
            <div class="mode">
                <h3 class="mode__title">Войти в комнату</h3>
                <input class="input-text centered" type="text" placeholder="Введите код">
            </div>
        </div>
        <button @click="say('Start')" class="button centered">Начать игру</button>
    </div>
</div>
</template>

<script>
export default {
    methods: {
        say (message) {
            console.log(message)
        }
    }
}
</script>
