<template>
<div class="container">
    <div class="content-game">
        <h2>Игра</h2>
        <audio ref="audio" :src="track" controls autoplay></audio>
    </div>
</div>
</template>

<script>
export default {
    computed: {
        track () {
            return this.$store.state.currentTrack
        }
    },
    mounted () {
        console.log(this.$refs.audio)
        this.$refs.audio.volume = 0.2
    }
}
</script>
