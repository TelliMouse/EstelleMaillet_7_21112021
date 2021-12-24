<template>
    <div class="view-Post">
        <fa icon="coffee" />
        <Post
        v-for="post in postList"
        :key="post.id"
        :postTitle="post.title"
        :postTextPost="isThereText(post.text)"
        :userName="post.userName"
        :post="post.text"
        :imageUrl="null"
        :imageAlt="null"
        :likeNumber="0"
        :dislikeNumber="0"
        :date="post.date"
        :postId="post.id"
        :postModConditions="false"
        :postImagePost="false"
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
            ]
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