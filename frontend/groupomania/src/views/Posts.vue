<template>
    <div>
        <HeaderPost />
        <div v-if="loadList">
            <Post 
                v-for="post in postList"
                :key="post.id"
                :postTitle="post.title"
                :post="post.text"
                :imageUrl="post.imageUrl" 
                :imageAlt="post.imageAlt" 
                :likeNumber="post.likes"
                :dislikeNumber="post.dislikes"
                :date="getDate(post.date)"
                :postId="post.id"
                :postModConditions="false"
                :postTextPost="isThereText(post.text)" 
                :postImagePost="!isThereText(post.text)"
                :userId="post.user_id"
                :postNeedLinkToPost="true"/>
        </div>
        <Pages />
    </div>
</template>

<script>
import HeaderPost from '../components/HeaderPost.vue'
import Post from '../components/Post.vue'
import Pages from '../components/Pages.vue'

export default {
    name: 'Posts',
    components: {
        HeaderPost,
        Post,
        Pages
    },
    data() {
        return {
            postList : this.getPostList(),
            //users: this.getUsers(),
            loadList: false,
            nameLoaded: false,
            //loaded: this.loadList && this.loadName
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
        getUserName(userId) {
            fetch(`http://localhost:3000/api/users/${userId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                const firstname = result.firstname;
                const lastname = result.lastname;
                this.nameLoaded = true;
                return firstname + ' ' + lastname;
            })
            .catch(err => {
                console.log('Error getUserName', err);
                alert('Une erreur s\'est produite');
                });
        },
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
        getCurrentPage() {
            const page = this.$route.query.page;

            if(!page) {
                return 1;
            } else {
                return parseInt(page, 10);
            }
        },
        getPostList() {
            fetch('http://localhost:3000/api/posts', {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                let postList = [];
                const currentPage = this.getCurrentPage();
                const majPostIndex = currentPage*10;
                const minPostIndex = majPostIndex - 10;
                
                for(let i = minPostIndex; i < majPostIndex; i++) {
                    if(result[i]) {
                        postList.push(result[i]);
                    }
                }

                this.loadList = true;
                return this.postList = result;
            })
            .catch(err => {
                console.log('Error getPostList', err);
                alert('Une erreur s\'est produite');
                });
        }
    }
}
</script>

<style>

</style>