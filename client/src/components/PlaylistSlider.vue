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
                spaceBetween: 72,
                slidesOffsetBefore: 10,
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
