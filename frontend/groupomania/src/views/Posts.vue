<template>
    <div>
        <HeaderPost />
        <Post 
            v-for="post in postList"
            :key="post.id"
            :postTitle="post.title" 
            :userName="getUserName(post.user_id)"
            :post="post.text"
            :imageUrl="post.imageUrl" 
            :imageAlt="post.imageAlt" 
            :likeNumber="post.likes"
            :dislikeNumber="post.dislikes"
            :date="getDate(post.date)"
            :postId="post.id"
            :postModConditions="false"
            :postTextPost="post.text" 
            :postImagePost="post.imageUrl"
            :userId="post.user_id"
            :linkToPost="getLinkToPost(post.id)"
            :postNeedLinkToPost="true"/>
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
            postList : this.getPostList()
        }
    },
    methods: {
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
                01: "Janvier",
                02: "Février",
                03: "Mars",
                04: "Avril",
                05: "Mai",
                06: "Juin",
                07: "Juillet",
                08: "Août",
                09: "Septembre",
                10: "Octobre",
                11: "Novembre",
                12: "Décembre"
            };

            const month = months[monthNum];

            return day + ' ' + month + ' ' + year + ', ' + hour + 'h' + minutes + 'm' + seconds + 's';
        },
        getCurrentPage() {
            const url = window.location.href;
            const urlParams = new URLSearchParams(url);

            if(!urlParams.get('page')) {
                return 1;
            } else {
                return parseInt(urlParams.get('page'), 10);
            }
        },
        getPostList() {
            fetch('http://localhost:3000/api/posts/desc')
            .then(res => {
                const result = JSON.parse(res.json());
                let postList;
                const currentPage = this.getCurrentPage();
                const majPostIndex = currentPage*10;   
                const minPostIndex = majPostIndex - 10;
                
                for(let i = minPostIndex; i < majPostIndex && result[i]; i++) {
                    postList.push(result[i]);
                }

                return postList;
            })
            .catch(err => console.log('Error getPostList', err));
        },
        getLinkToPost(postId) {
            return `/post?id=${postId}`;
        }
    }
}
</script>

<style>

</style>