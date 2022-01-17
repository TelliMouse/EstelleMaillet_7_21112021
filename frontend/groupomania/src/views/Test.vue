<template>
    <div class="view-Post">
        <HeaderNewPost />
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
                :postNeedLinkToPost="false"
                @post-modified="modifyPost"/>
            <BlankComment 
                :postId="post.id"
                @new-comment-published="addNewComment"/>
        </div>
        <div v-if="commentLoaded">
            <PublishedComment 
                v-for="comment in commentList"
                :key="comment.id"
                :propComment="comment.text"
                :likeNumber="comment.likes"
                :dislikeNumber="comment.dislikes"
                :date="getDate(comment.date)"
                :userId="comment.user_id"
                :commentId="comment.id"
                @comment-modified="modifyComment"
                @comment-deleted="deleteComment"/>
        </div>
    </div>
</template>

<script>
import Post from '../components/Post.vue'
import HeaderNewPost from '../components/HeaderNewPost.vue'
import BlankComment from '../components/BlankComment.vue'
import PublishedComment from '../components/PublishedComment.vue'

export default {
    name: 'Test',
    components: {
        Post,
        HeaderNewPost,
        BlankComment,
        PublishedComment
    },
    data() {
        return {
            post: this.getPost(),
            commentList: this.getComments(),
            loaded: false,
            commentLoaded: false
        }
    },
    methods: {
        isThereText(text) {
            if(text) {
                return true;
            } else {
                return false;
            }
        },
        getDate(date) {
            //console.log('params: ', this.$router.query.id);
            console.log('date:', date)
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
                '1': "Janvier",
                '02': "Février",
                '2': "Février",
                '03': "Mars",
                '3': "Mars",
                '04': "Avril",
                '4': "Avril",
                '05': "Mai",
                '5': "Mai",
                '06': "Juin",
                '6': "Juin",
                '07': "Juillet",
                '7': "Juillet",
                '08': "Août",
                '8': "Août",
                '09': "Septembre",
                '9': "Septembre",
                '10': "Octobre",
                '11': "Novembre",
                '12': "Décembre"
            };

            const month = months[monthNum];

            return day + ' ' + month + ' ' + year + ', ' + hour + 'h' + minutes + 'm' + seconds + 's';
        },
        getPost() {
            const postId = this.$route.query.id;

            fetch(`http://localhost:3000/api/posts/${postId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                console.log('res getpost', result);
                this.loaded = true;
                return this.post = result[0];
            })
            .catch(err => console.log('Error getPost', err));
        },
        getComments() {
            //const url = window.location.href;
            //const urlParams = new URLSearchParams(url);
            //const postId = urlParams.get('id');
            const postId = 15;

            fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                this.commentLoaded = true;
                return this.commentList = result;
            })
            .catch(err => console.log('Error getComments', err));
        },
        //reloadPage() {
        //    this.$forceUpdate();
        //}
        addNewComment(payload) {
            console.log('addnewcomment payload: ', payload);
            this.commentList.push({
                ...payload,
                likes: 0,
                dislikes: 0,
                usersLike: [],
                usersDislike: []
            });
        },
        modifyComment(payload) {
            //trouver l'index du comment à changer dans commentList
            const findIndexOfComment = () => {
                for(let i = 0; i < this.commentList.length; i++) {
                    if(this.commentList[i].id == payload.id)  {
                        return i
                    }
                }
            };

            const index = findIndexOfComment();
            this.commentList[index].text = payload.text;
        },
        deleteComment(payload) {
            const findIndexOfComment = () => {
                for(let i = 0; i < this.commentList.length; i++) {
                    if(this.commentList[i].id == payload.id)  {
                        return i
                    }
                }
            };

            const index = findIndexOfComment();
            this.commentList.splice(index, 1);
        },
        modifyPost() {
            this.loaded = false;
            return this.post = this.getPost();
        }
    }
}
</script>

<style>
div.view-Post {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>