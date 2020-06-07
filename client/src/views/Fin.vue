<template>
<div class="content-game">
    <div class="results">
            <!--TODO: Место под обложку плейлиста-->
            <img class="curPlaylist" :src="currentPlaylist" alt="Playlist Image">
            <!--TODO: Вставить имя победителя-->
            <!-- <div class="card">
                <h3>Победитель - jaymay3!</h3>
            </div> -->
            <div class="card">
                <!--TODO: Заменить на имена и очки-->
                <table>
                    <tr>
                        <td>5 песен</td>
                        <td class="th-right">jaymay3</td>
                    </tr>
                    <tr>
                        <td>3 песни</td>
                        <td class="th-right">meloman17</td>
                    </tr>
                    <tr>
                        <td>2 песни</td>
                        <td class="th-right">nerd2002</td>
                    </tr>
                    <tr>
                        <td>1 песня</td>
                        <td class="th-right">shalashaska</td>
                    </tr>
                </table>
            </div>
    </div>

    <div class="info-block">
        <button @click="goHome" class="card button">
            <h3>На главную</h3>
        </button>

        <button @click="goGame" class="card button">
            <h3>Сыграть ещё</h3>
        </button>
    </div>
</div>
</template>

<style>
    .th-right{
        text-align:right;
        margin-left:auto;
    }
</style>
<script>
export default {
    computed: {
        currentPlaylist () {
            return this.$store.state.playlistImage
        }
    },
    methods: {
        goHome () {
            this.$router.push('/')
        },
        goGame () {
            // TODO: использовать ту же комнату, что и была
            // TODO: для разных пользователей разные страницы (выбор или ожидание)
            this.$router.push('selection')
        }
    }
}

</script>
