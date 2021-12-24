<template>
    <div>
        <h3>{{ userName }}</h3>
        <label for="comment">Votre commentaire:</label>
        <textarea name="text" id="comment" cols="30" rows="10" v-model="comment"></textarea>
        <button @click="publishComment">Publier</button>
    </div>
</template>

<script>
export default {
    name: 'BlankComment',
    props: {
        postId: Number,
        userName: String
    },
    data() {
        return {
            comment: ''
        }
    },
    methods: {
        publishComment() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            const date = new Date(Date.now());
            const commentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            fetch(`http://localhost:3000/api/comments`, {
                method: 'POST',
                headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: currentUserId,
                    post_id: this.postId,
                    text: this.comment,
                    date: commentDate
                })
            })
            .then(() => {
                alert('Votre commentaire a été publié.');
                this.$emit('new-comment-published', {
                    user_id: currentUserId,
                    post_id: this.postId,
                    text: this.comment,
                    date: commentDate
                });
            })
            .catch(err => console.log('Error publishComment', err));
        }
    }
}
</script>

<style>

</style>