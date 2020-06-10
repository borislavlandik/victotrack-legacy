<script>
export default {
    created () {
        if (this.$route.params.method === 'login') {
            window.open(this.$store.state.urls.loginUrl, '_self')
        } else if (this.$route.params.method === 'authorized') {
            localStorage.setItem('redirect', 'ok')
            window.close()
        } else {
            window.close()
        }
    }
}
</script>
