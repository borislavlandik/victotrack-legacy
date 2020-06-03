module.exports = {
    publicPath: '',
    css: {
        loaderOptions: {
            sass: {
                prependData: '@import "@/scss/style.scss";'
            }
        }
    }
}
