<template>
    <div class="view-Post">
        <Post
        v-for="post in postList"
        :key="post.id"
        :postTitle="post.title"
        :postTextPost="isThereText(post.text)"
        :userName="getUserName(post.id)"
        :post="post.text"
        :imageUrl="post.imageUrl"
        :imageAlt="post.imageAlt"
        :likeNumber="post.likes"
        :dislikeNumber="post.dislikes"
        :date="getDate(post.date)"
        :postId="post.id"
        :postModConditions="true"
        :postImagePost="!isThereText(post.text)"
        :userId="post.user_id"
        :linkToPost="null"
        :postNeedLinkToPost="false"/>
        <button @click="add">Ajouter</button>
    </div>
</template>

<script>
import Post from '../components/Post.vue'

export default {
    name: 'Test',
    components: {
        Post
    },
    data() {
        return {
            name: '',
            post: 'Ceci est un test',
            postList: [
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
]
            /*[
                {
                    id: 1,
                    title: 'Titre 1',
                    text: 'Texte 1',
                    userName: 'User1',
                    date: 'Date1',
                    user_id: 1
                },
                {
                    id: 2,
                    title: 'Titre 2',
                    text: 'Texte 2',
                    userName: 'User2',
                    date: 'Date2',
                    user_id: 2
                }
            ]*/
        }
    },
    methods: {
        add() {
            const post3 = {
                id: 3,
                title: 'Titre 3',
                text: 'Texte 3',
                userName: 'User3',
                date: 'Date3',
                user_id: 3
            };

            this.postList.push(post3);
        },
        isThereText(text) {
            if(text) {
                return true;
            } else {
                return false;
            }
        },
        getUserName(userId) {
            console.log('getUserName');
            fetch(`http://localhost:3000/api/users/${userId}`)
            .then(res => res.json())
            .then(result => {
                console.log('user nam result: ', result);
                const firstname = result.firstname;
                console.log('firstname: ', firstname);
                const lastname = result.lastname;
                console.log('lastname: ', lastname);
                const name = `${firstname} ${lastname}`
                return name;
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
    },
    //created() {
    //    this.name = this.getUserName(2);
    //}
}
</script>

<style>
div.view-Post {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>