<template>
    <div class="blank-comment">
        <h3 v-if="loadName">{{ userName }}</h3>
        <label for="comment">Votre commentaire:</label>
        <textarea name="text" id="comment" cols="30" rows="10" v-model="comment" placeholder="Ecrivez votre commentaire ici!"></textarea>
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
        /**
         * Retrieve the name of the user from their id
         */
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
        /**
         * Add the comment to the database and display it on the page
         */
        publishComment() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            const date = new Date(Date.now());
            //We transform the date to match the format "yyyy-mm-ddThh-mm-ss" in the database
            const commentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            if(this.comment) {
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
                        //We pass the comment in the payload to add it to the array of comment to be displayed, in the mother component
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
            } else {
                alert('Veuillez écrire dans le champs de saisie avant de publier votre commentaire');
            } 
        }
    }
}
</script>

<style lang="scss">
div.blank-comment {
    display: flex;
    flex-direction: column;
    width: 85%;
    background-color: #A1EF8B;
    margin-top: 2em;
    border-radius: 15px/15px;
    padding-left: 0.75em;
    padding-right: 0.75em;
    padding-bottom: 1em;
    min-width: fit-content;
    &>h3 {
        font-size: 1.1em;
        color: #4C061D;
    }
    &>label {
        font-size: 1em;
        margin-bottom: 0.5em;
    }
    &>textarea {
        border: solid 2px #92D5E6;
        border-radius: 15px/15px;
    }
    &>button {
        margin-top: 1em;
        width: 20%;
        min-width: fit-content;
        align-self: center;
        color: white;
        background-color: #4C061D;
        border-radius: 15px/15px;
        border: none;
        padding-top: 0.5em;
        padding-bottom: 0.5em;
        box-shadow: 2px 2px 3px #11020F;
        cursor: pointer;
    }
}
</style>