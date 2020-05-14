<template>
    <div class="playlist">
        <swiper class="playlist__slider" :options="swiperOptions" @click-slide="changePlaylist">
            <swiper-slide v-for="(item, index) in 10" :key="index">
                <playlist-item :class="{ 'active': activeIndex === index }"
                    :name="index" :img="'https://source.unsplash.com/random/250x250?sig=' + index">
                </playlist-item>
            </swiper-slide>
            <div class="playlist__pagination" slot="pagination"></div>
        </swiper>
        <div class="playlist-next-btn">
            <button class="button playlist__next">&#62;</button>
        </div>
        <div class="playlist-prev-btn">
            <button class="button playlist__prev">&#60;</button>
        </div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import PlaylistItem from '@/components/PlaylistItem'
import 'swiper/css/swiper.css'

export default {
    data () {
        return {
            swiperOptions: {
                slidesPerView: 'auto',
                slideToClickedSlide: true,
                spaceBetween: 50,
                centeredSlides: true,
                pagination: {
                    el: '.swiper-pagination'
                },
                navigation: {
                    nextEl: '.playlist-next-btn',
                    prevEl: '.playlist-prev-btn'
                }
            },
            activeIndex: null
        }
    },
    methods: {
        changePlaylist (index) {
            this.activeIndex = index
            this.$store.commit('changePlaylistIndex', index)
        }
    },
    components: {
        Swiper, SwiperSlide, PlaylistItem
    }
}
</script>

<style lang="scss">
    .swiper-slide {
        width: 250px;
    }
</style>
