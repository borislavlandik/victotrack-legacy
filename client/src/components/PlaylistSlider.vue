<template>
    <div class="playlist">
        <swiper class="playlist__slider" :options="swiperOptions" @click-slide="changePlaylist">
            <swiper-slide v-for="(playlist, index) in playlists" :key="playlist.id">
                <playlist-item :class="{ 'active': activeIndex === index }"
                    :name="playlist.name" :img="playlist.image">
                </playlist-item>
            </swiper-slide>
            <div class="playlist__pagination" slot="pagination"></div>
        </swiper>
        <div class="playlist-next-btn">
           <button class="button playlist__next"><!--&#62;--><div class="card"> <img alt="&#62;" src="..\assets\images\icons\toright.svg" draggable="false"></div></button>
        </div>
        <div class="playlist-prev-btn">
            <button class="button playlist__prev"><!--&#60;--><div class="card"> <img alt="&#60;" src="..\assets\images\icons\toleft.svg" draggable="false"></div></button>
        </div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import PlaylistItem from '@/components/PlaylistItem'
import 'swiper/css/swiper.css'

export default {
    props: {
        playlists: Array
    },
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
                },
                mousewheel: {
                    invert: true,
                    sensitivity: 2,
                    eventsTarget: 'playlist__slider'
                }
            },
            activeIndex: null
        }
    },
    methods: {
        changePlaylist (index) {
            this.activeIndex = index
            this.$store.commit('set', { key: 'selectedPlaylist', value: this.playlists[index].id })
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
