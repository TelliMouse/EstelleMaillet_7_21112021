<template>
    <div>
        <HeaderPost />
        <Post 
            v-for="post in postList"
            :key="post.id"
            :postTitle="post.title"
            :userName="getFirstName(post.id) + getLastName(post.id)"
            :text="post.text"
            :imageUrl="post.imageUrl"
            :imageAlt="post.imageAlt"
            :likeNumber="post.likes"
            :dislikeNumber="post.dislikes"
            :date="getDate(post.id)"
            :modConditions="false"
            :modConditionsAndAdmin="false"
            :postTextPost="textPost(post.id)"
            :postImagePost="imagePost(post.id)"/>
        <Pages />
    </div>
</template>

<script>
import HeaderPost from '../components/HeaderPost.vue'
import Post from '../components/Post.vue'
import Pages from '../components/Pages.vue'

export default {
    name: 'Post',
    components: {
        HeaderPost,
        Post,
        Pages
    },
    data() {
        return {
            postList : []
        }
    },
    methods: {
        getFirstName(postId) {
            return postId
        },
        getLastName(postId) {
            return postId
        },
        getDate(postId) {
            return postId
        },
        textPost(postId) {
            return postId;
        },
        imagePost(postId) {
            return postId;
        }
    }
}
</script>

<style>

</style>