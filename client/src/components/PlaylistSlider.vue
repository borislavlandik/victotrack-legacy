<template>
    <div class="playlist">
        <swiper class="playlist__slider" :options="swiperOptions" @click-slide="changePlaylist">
            <swiper-slide v-for="(playlist, index) in playlists" :key="playlist.id">
                <playlist-item :class="{ 'active': activeIndex === index }"
                    :name="playlist.name" :img="playlist.image">
                </playlist-item>
            </swiper-slide>
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
    .playlist {
        padding: 50px 0;
        position: relative;

        &__slider {
            width: 100%;
            height: 275px;
        }

        @include _480 {
            padding: 5px 0;

            &__slider {
                height: 240px;
            }
        }
    }

    .playlist-item {
        width: 250px;
        height: 250px;
        position: relative;

        border-radius: 15px;
        box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.25);

        &__name {
            width: 100%;
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);

            color: $text-color;
            text-align: center;

            opacity: 0;
            transition: opacity .2s ease-in-out;
        }

        &__image {
            background: $accent-color;

            border-radius: inherit;

            img {
                display: block;
                max-width: 100%;
                height: auto;

                border-radius: inherit;

                transition: opacity .2s ease-in-out;
            }
        }

        &:hover {
            .playlist-item__image img {
                opacity: 0.2;
            }

            .playlist-item__name {
                opacity: 1;
            }
        }

        &.active {
            &:hover {
                img {
                    opacity: 0;
                }
            }

            img {
                opacity: 0;
            }

            .playlist-item__name {
                opacity: 1;
            }
        }

        @include _480 {
            width: 220px;
            height: 220px;
        }
    }

    .swiper-slide {
        margin: 0 36px;
        width: 250px;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }

        @include _480 {
            margin: 0 10px;
        }
    }
</style>
