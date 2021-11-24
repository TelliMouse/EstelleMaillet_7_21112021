<template>
    <div>
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

<style>

</style>