<template>
<div class="playlist-item">
    <div class="playlist-item__image" >
        <img :src="img" :alt="name">
    </div>
    <h3 class="playlist-item__name">{{name}}</h3>
</div>
</template>

<script>
export default {
    props: {
        img: String,
        name: String
    }
}
</script>
