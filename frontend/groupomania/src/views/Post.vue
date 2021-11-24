<template>
    <div>
        <HeaderPost />
        <Post 
            postTile="{{ post.title }}"
            userName="{{ post.userName }}"
            propPost="{{ post.text }}"
            imageUrl="{{ post.imageUrl }}"
            imageAlt="{{ post.imageAlt }}"
            likeNumber="{{ post.likes }}"
            dislikeNumber="{{ post.dislikes }}"
            date="{{ post.date }}" />
        <BlankComment userName="{{ currentUserName }}"/>
        <PublishedComment 
            v-for="comment in commentList"
            :key="comment.id"
            :userName="commentUserName"
            :propComment="comment.text"
            :likeNumber="comment.likes"
            :dislikeNumber="comment.dislikes"
            :date="writeDate(comment.date)"/>
    </div>
</template>

<script>
import Post from '../components/Post.vue'
import HeaderPost from '../components/HeaderPost.vue'
import BlankComment from '../components/BlankComment.vue'
import PublishedComment from '../components/PublishedComment.vue'

export default {
    name: 'Post',
    components: {
        Post,
        HeaderPost,
        BlankComment,
        PublishedComment
    },
    data() {
        return {
            post: {},
            currentUserName: '',
            commentList: {},
            commentUserName: ''
        }
    },
    methods: {
        writeDate(sqlDate) {
            return sqlDate
        }
    }
}
</script>

<style>

</style>