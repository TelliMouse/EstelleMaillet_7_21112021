<template>
    <div>
        <HeaderPost />
        <Post 
            postTile="{{ post.title }}"
            postTextPost="{{ post.text }}"
            userName="{{ getUserName(post.user_id) }}"
            post="{{ post.text }}"
            imageUrl="{{ post.imageUrl }}"
            imageAlt="{{ post.imageAlt }}"
            likeNumber="{{ post.likes }}"
            dislikeNumber="{{ post.dislikes }}"
            date="{{ getDate(post.date) }}"
            postId="{{ postId }}"
            postModConditions="{{ true }}" 
            postImagePost="{{ post.imageUrl }}"
            userId="{{ post.user_id }}"
            linkToPost="{{ null }}"
            postNeedLinkToPost="{{ false }}"/>
        <BlankComment 
            postId="{{ post.id }}"
            userName="{{ getUserName(parseInt(localStorage.getItem('currentUserId'), 10)) }}"
            @new-comment-publisehd="reloadPage"/>
        <PublishedComment 
            v-for="comment in commentList"
            :key="comment.id"
            :userName="getUserName(comment.user_id)"
            :propComment="comment.text"
            :likeNumber="comment.likes"
            :dislikeNumber="comment.dislikes"
            :date="getDate(comment.date)"/>
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
            post: this.getPost(),
            commentList: this.getComments(),
        }
    },
    methods: {
        getDate(date) {
            //"YYYY-MM-DD HH:MM:SS"
            const firstSplit = date.split('-');
            const year = firstSplit[0];
            const monthNum = firstSplit('-')[1];
            const secondSplit = firstSplit[2].split(' ');
            const day = secondSplit[0];
            const thirdSplit = secondSplit[1].split(':');
            const hour = thirdSplit[0];
            const minutes = thirdSplit[1];
            const seconds = thirdSplit[2];

            const months = {
                '01': "Janvier",
                '02': "Février",
                '03': "Mars",
                '04': "Avril",
                '05': "Mai",
                '06': "Juin",
                '07': "Juillet",
                '08': "Août",
                '09': "Septembre",
                '10': "Octobre",
                '11': "Novembre",
                '12': "Décembre"
            };

            const month = months[monthNum];

            return day + ' ' + month + ' ' + year + ', ' + hour + 'h' + minutes + 'm' + seconds + 's';
        },
        getUserName(userId) {
            fetch(`http://localhost:3000/api/users/${userId}`)
            .then(res => {
                const result = JSON.parse(res.json());
                const firstname = result.firstname;
                const lastname = result.lastname;
                return firstname + ' ' + lastname;
            })
            .catch(err => console.log('Error getUserName', err));
        },
        getPost() {
            const url = window.location.href;
            const urlParams = new URLSearchParams(url);
            const postId = urlParams.get('id');

            fetch(`http://localhost:3000/api/posts/${postId}`)
            .then(res => {
                const result = JSON.parse(res.json());
                return result;
            })
            .catch(err => console.log('Error getPost', err));
        },
        getComments() {
            const url = window.location.href;
            const urlParams = new URLSearchParams(url);
            const postId = urlParams.get('id');

            fetch(`http://localhost:3000/api/posts/${postId}/comments`)
            .then(res => {
                const result = JSON.parse(res.json());
                return result
            })
            .catch(err => console.log('Error getComments', err));
        },
        reloadPage() {
            this.$forceUpdate();
        }
    }
}
</script>

<style>

</style>