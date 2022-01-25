<template>
    <div class="new-post">
        <HeaderNewPost />
        <BlankPost />
    </div>
</template>

<script>
import HeaderNewPost from '../components/HeaderNewPost.vue'
import BlankPost from '../components/BlankPost.vue'

export default {
    name: 'NewPost',
    components: {
        HeaderNewPost,
        BlankPost
    }
}
</script>

<style lang="scss">
div.new-post {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>