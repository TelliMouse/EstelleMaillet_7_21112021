<template>
    <div class="view-Post">
        <HeaderPost />
        <div v-if="loaded">
            <Post 
                :postTitle="post.title" 
                :post="post.text"
                :imageUrl="post.imageUrl" 
                :imageAlt="post.imageAlt" 
                :likeNumber="post.likes"
                :dislikeNumber="post.dislikes"
                :date="getDate(post.date)"
                :postId="post.id"
                :postModConditions="true"
                :postTextPost="isThereText(post.text)" 
                :postImagePost="!isThereText(post.text)"
                :userId="post.user_id"
                :postNeedLinkToPost="false"/>
        </div>
        <BlankComment 
            :postId="post.id"
            @new-comment-publisehd="addNewComment"/>
        <div v-if="commentLoaded">
            <PublishedComment 
                v-for="comment in commentList"
                :key="comment.id"
                :userName="getUserName(comment.user_id)"
                :propComment="comment.text"
                :likeNumber="comment.likes"
                :dislikeNumber="comment.dislikes"
                :date="getDate(comment.date)"/>
        </div>
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
            //"yyyy-mm-ddThh:mm:ss.000Z"
            const firstSplit = date.split('-'); //['yyyy', 'mm', 'ddThh:mm:ss.000Z']
            const year = firstSplit[0]; // 'yyyy'
            const monthNum = firstSplit[1]; //'mm'
            const secondSplit = firstSplit[2].split('T'); // ['dd', 'hh:mm:ss.000Z']
            const day = secondSplit[0]; // 'dd'
            const thirdSplit = secondSplit[1].split(':'); // ['hh', 'mm', 'ss.000Z']
            const hour = thirdSplit[0]; // 'hh'
            const minutes = thirdSplit[1]; // 'mm'
            const fourthSplit = thirdSplit[2].split('.'); // ['ss', '000Z']
            const seconds = fourthSplit[0]; // 'ss'

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
        //reloadPage() {
        //    this.$forceUpdate();
        //}
        addNewComment(payload) {
            this.commentList.push(payload);
        }
    }
}
</script>

<style>
div.view-Post {
    display: flex;
}
</style>