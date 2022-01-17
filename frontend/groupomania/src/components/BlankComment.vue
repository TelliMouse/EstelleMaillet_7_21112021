<template>
    <div>
        <h3 v-if="loadName">{{ userName }}</h3>
        <label for="comment">Votre commentaire:</label>
        <textarea name="text" id="comment" cols="30" rows="10" v-model="comment"></textarea>
        <button @click="publishComment">Publier</button>
    </div>
</template>

<script>
export default {
    name: 'BlankComment',
    props: {
        postId: Number
    },
    data() {
        return {
            comment: '',
            userName: this.getUserName(),
            loadName: false
        }
    },
    methods: {
        getUserName() {
            const userId = parseInt(localStorage.getItem('currentUserId'), 10)
            fetch(`http://localhost:3000/api/users/${userId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                const firstname = result.firstname;
                const lastname = result.lastname;
                this.loadName = true;
                return this.userName = firstname + ' ' + lastname;
            })
            .catch(err => {
                console.log('Error getUserName', err);
                alert('Une erreur s\'est produite');
            });
        },
        publishComment() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            const date = new Date(Date.now());
            const commentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            fetch(`http://localhost:3000/api/comments`, {
                method: 'POST',
                credentials: 'include',
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
            .then(res => res.json())
            .then(result => {
                if(result.error) {
                    alert('Une erreur est survenue');
                } else {
                    alert('Votre commentaire a été publié.');
                    this.$emit('new-comment-published', {
                        id: result.id,
                        user_id: currentUserId,
                        post_id: this.postId,
                        text: this.comment,
                        date: commentDate
                    });
                    this.comment = '';
                }
            })
            .catch(err => {
                console.log('Error publishComment', err);
                alert('Une erreur s\'est produite');
            });
        }
    }
}
</script>

<style>

</style>