<template>
    <div>
        <h1>{{ postTitle}}</h1>
        <h2>{{ userName }}</h2>
        <textarea v-if="something" name="textarea" readonly rows="5" cols="30" v-model="post"></textarea>
        <img v-if="something" src="{{ imageUrl }}" alt="{{ imageAlt }}"/>
        <LikesAndButtons 
            likeNumbre="{{ likeNumber }}"
            dislikeNumbe="{{ dislikeNumber }}"
            date="{{ date }}"
            postId="{{ postId }}"/>
    </div>
</template>

<script>
import LikesAndButtons from './LikesAndButtons.vue'

export default {
    name: 'Post',
    components: {
        LikesAndButtons
    },
    props: {
        postTitle: String,
        userName: String,
        propPost: String,
        imageUrl: String,
        imageAlt: String,
        likeNumber: Number,
        dislikeNumber: Number,
        date: String,
        postId: Number
    },
    data() {
        return {
            post: this.propPost
        }
    }
}
</script>

<style>

</style>