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
            this.$emit('changePlaylist', this.activeIndex)
        }
    },
    components: {
        Swiper, SwiperSlide, PlaylistItem
    }
}
</script>

<style lang="scss">
    .swiper-slide {
        margin: 0 36px;
        width: 250px;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }
    }
</style>
