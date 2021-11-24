<template>
    <div>
        <h3>{{ userName }}</h3>
        <textarea name="textarea" rows="5" cols="30" readonly v-model="comment"></textarea>
        <LikesAndButtons 
            likeNumber="{{ likeNumber }}"
            dislikeNumber="{{ dislikeNumber }}"
            date="{{ date }}" />
    </div>
</template>

<script>
import LikesAndButtons from './LikesAndButtons.vue'

export default {
    name: 'PublishedComment',
    components: {
        LikesAndButtons
    },
    props: {
        userName: String,
        propComment: String,
        likeNumber: Number,
        dislikeNumber: Number,
        date: String
    },
    data() {
        return {
            comment: this.propComment
        }
    }
}
</script>

<style>

</style>