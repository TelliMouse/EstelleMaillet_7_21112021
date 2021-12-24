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
            postList : [/*{
        id: 10,
        user_id: 2,
        text: 'inside data',
        imageUrl: null,
        imageAlt: null,
        likes: 0,
        dislikes: 0,
        usersLike: "[]",
        usersDislike: "[]",
        date: "2021-12-22T15:51:40.000Z",
        title: "essai inside data"
    }*/],
            /*result: [
    {
        id: 8,
        user_id: 2,
        text: null,
        imageUrl: "http://localhost:3000/images/téléchargement.jpg1640188300275.jpg",
        imageAlt: "essai formdata",
        likes: 0,
        dislikes: 0,
        usersLike: "[]",
        usersDislike: "[]",
        date: "2021-12-22T15:51:40.000Z",
        title: "essai formdata2"
    },
    {
        id: 6,
        user_id: 2,
        text: "test",
        imageUrl: null,
        imageAlt: null,
        likes: 0,
        dislikes: 0,
        usersLike: "[]",
        usersDislike: "[]",
        date: "2021-12-17T16:56:15.000Z",
        title: "test text formdata"
    },
    {
        id: 5,
        user_id: 2,
        text: null,
        imageUrl: "",
        imageAlt: "test image",
        likes: 0,
        dislikes: 0,
        usersLike: "[]",
        usersDislike: "[]",
        date: "2021-12-15T14:33:43.000Z",
        title: "test image"
    },
    {
        id: 4,
        user_id: 2,
        text: null,
        imageUrl: "",
        imageAlt: "image test",
        likes: 0,
        dislikes: 0,
        usersLike: "[]",
        usersDislike: "[]",
        date: "2021-12-15T14:28:49.000Z",
        title: "test image"
    },
    {
        id: 3,
        user_id: 2,
        text: null,
        imageUrl: "",
        imageAlt: "test image",
        likes: 0,
        dislikes: 0,
        usersLike: "[]",
        usersDislike: "[]",
        date: "2021-12-15T14:23:42.000Z",
        title: "test image"
    },
    {
        id: 2,
        user_id: 2,
        text: "Autre test sans auth",
        imageUrl: null,
        imageAlt: null,
        likes: 0,
        dislikes: 0,
        usersLike: "[]",
        usersDislike: "[]",
        date: "2021-12-14T15:41:28.000Z",
        title: "Deuxième test"
    },
    {
        id: 1,
        user_id: 2,
        text: "essai modification",
        imageUrl: null,
        imageAlt: null,
        likes: 0,
        dislikes: 0,
        usersLike: "[]",
        usersDislike: "[]",
        date: "2021-12-14T15:39:03.000Z",
        title: "Premier test sans auth"
    }
]*/
        }
    },
    methods: {
        getUserName(userId) {
            console.log('getUserName');
            fetch(`http://localhost:3000/api/users/${userId}`)
            .then(res => res.json())
            .then(result => {
                const firstname = result.firstname;
                const lastname = result.lastname;
                return firstname + ' ' + lastname;
            })
            .catch(err => console.log('Error getUserName', err));
        },
        getDate(date) {
            //"yyyy-mm-ddThh:mm:ss.000Z"
            console.log('date: ', date);
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
            console.log('getCurrentPage');
            const url = window.location.href;
            const urlParams = new URLSearchParams(url);

            if(!urlParams.get('page')) {
                console.log('return getCurrentPage: ', 1);
                return 1;
            } else {
                console.log('return getCurrentPage: ', parseInt(urlParams.get('page'), 10));
                return parseInt(urlParams.get('page'), 10);
            }
        },
        getPostList() {
            console.log('getPostList');
            fetch('http://localhost:3000/api/posts')
            .then(res => res.json())
            .then(result => {
                let postList = [];
                const currentPage = this.getCurrentPage();
                console.log('currentPage', currentPage)
                const majPostIndex = currentPage*10;
                console.log('majPostIndex: ', majPostIndex);
                const minPostIndex = majPostIndex - 10;
                console.log('minPostIndex: ', minPostIndex);
                
                for(let i = minPostIndex; i < majPostIndex; i++) {
                    console.log('round ', i);
                    console.log('result i: ', result[i]);
                    if(result[i]) {
                        console.log('push')
                        postList.push(result[i]);
                    }
                }

                //this.postList = postList;
                //console.log('return getPostList: ', postList);
                return postList;
            })
            .catch(err => console.log('Error getPostList', err));
        },
        getLinkToPost(postId) {
            console.log('getLinkToPost');
            return `/post?id=${postId}`;
        }
    },
    created() {
        /*this.getPostList().then(list => {
            this.postList = list
        })
        console.log('mounted postlist: ', this.postList);*/
        this.postList = this.getPostList();
    }
    //mounted() {
      //  console.log('mounted postlist: ', this.postList);
    //}
}
</script>

<style>

</style>