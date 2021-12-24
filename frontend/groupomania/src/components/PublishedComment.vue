<template>
    <div>
        <h3>{{ userName }}</h3>
        <p v-if="!modifyClicked">{{ comment }}</p>
        <textarea v-if="modifyClicked" name="textarea" v-model="comment"></textarea>
        <div>
            <div>
                <button @click="likeClicked"><fa icon="thumbs-up" v-if="liked" alt="Icone de like"/><fa icon="thumbs-up" v-if="!liked" alt="Icone de like"/> {{ shownLikeNumber }}</button>
                <button @click="dislikeClicked"><fa icon="thumbs-down" v-if="disliked" alt="Icone de dislike"/><fa icon="thumbs-down" v-if="!disliked" alt="Icone de dislike"/> {{ shownDislikeNumber }}</button>
            </div>
            <p>{{ date }}</p>
        </div>
        <p id="likeErrorMessage"></p>
        <button v-if="modifyClicked" @click="modifyComment">Publier</button>
        <div>
            <button v-if="modConditions" @click="modifyButton">Modifier</button>
            <button v-if="modConditions || modConditionsAndAdmin" @click="deleteComment">Supprimer</button>
            <input/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PublishedComment',
    props: {
        userName: String,
        propComment: String,
        likeNumber: Number,
        dislikeNumber: Number,
        date: String,
        commentId: Number,
        userId: Number //id of the person who made the comment
    },
    data() {
        return {
            comment: this.propComment,
            liked: this.isLiked(),
            disliked: this.isDisliked(),
            modifyClicked: false,
            shownLikeNumber: this.likeNumber,
            shownDislikeNumber: this.dislikeNumber
        }
    },
    methods: {
        hasTheUserAlreadyLiked() {
            const currentUserId = localStorage.getItem('currentUserId');

            fetch(`http://localhost:3000/api/comments/${this.commentId}`)
            .then(res => {
                
                const result = res.json();
                const likeList = JSON.parse(result.usersLike);
                const dislikeList = JSON.parse(result.usersDislike);

                for(let userId of likeList) {
                    if(currentUserId == userId) {
                        return 'liked';
                    }
                }

                for(let userId of dislikeList) {
                    if(currentUserId == userId) {
                        return 'disliked';
                    }
                }

                return false;
            })
            .catch(err => console.log('Error hasTheUserAlreadyLiked', err));
        },
        isLiked() {
            if(this.hasTheUserAlreadyLiked() === 'liked') {
                return true;
            } else {
                return false;
            }
        },
        isDisliked() {
            if(this.hasTheUserAlreadyLiked() === 'disliked') {
                return true;
            } else {
                return false;
            }
        },
        likeClicked() {
            if(this.hasTheUserAlreadyLiked() === false) {
                fetch(`http://localhost:3000/api/comments/${this.commentId}/like`, {
                    method: 'POST',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: JSON.parse(localStorage.getItem('currentUserId')),
                        like: 1
                    })
                })
                .then(() => {
                    this.shownLikeNumber++;
                    this.liked = true;
                })
                .catch(err => console.log('Error likeClicked', err));
            } else if(this.hasTheUserAlreadyLiked() === 'liked') {
                fetch(`http://localhost:3000/api/comments/${this.commentId}/like`, {
                    method: 'POST',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: JSON.parse(localStorage.getItem('currentUserId')),
                        like: 0
                    })
                })
                .then(() => {
                    this.shownLikeNumber--;
                    this.liked = false;
                })
                .catch(err => console.log('Error likeClicked', err));
            } else {
                const messagePlace = document.getElementById('likeErrorMessage');
                messagePlace.innerText = 'Vous ne pouvez pas liker ce commentaire.'
            }
        },
        dislikeClicked() {
            if(this.hasTheUserAlreadyLiked() === false) {
                fetch(`http://localhost:3000/api/comments/${this.commentId}/like`, {
                    method: 'POST',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: JSON.parse(localStorage.getItem('currentUserId')),
                        like: -1
                    })
                })
                .then(() => {
                    this.shownDislikeNumber++;
                    this.disliked = true;
                })
                .catch(err => console.log('Error dislikeClicked', err));
            } else if(this.hasTheUserAlreadyLiked() === 'disliked') {
                fetch(`http://localhost:3000/api/comments/${this.commentId}/like`, {
                    method: 'POST',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: JSON.parse(localStorage.getItem('currentUserId')),
                        like: 0
                    })
                })
                .then(() => {
                    this.shonwDislikeNumber--;
                    this.disliked = false;
                })
                .catch(err => console.log('Error dislikeClicked', err));
            } else {
                const messagePlace = document.getElementById('likeErrorMessage');
                messagePlace.innerText = 'Vous ne pouvez pas disliker ce commentaire.'
            }
        },
        modifyButton() {
            this.modifyClicked = true;
        },
        modifyComment() {
            const modifiedComment = {
                text: this.comment
            };
            fetch(`http://localhost:3000/api/comments/${this.commentId}`, {
                method: 'PUT',
                headers: {
                "Accept": "application/json", 
                "Content-Type": "application/json"
                },
                body: JSON.stringify(modifiedComment)
            })
            .then(() => {
                alert('Le commentaire a bien été modifiée!')
                this.$router.push({ name: 'Posts'});
            })
            .catch(err => console.log('Error modifyComment', err))
        },
        deleteComment() {
            fetch(`http://localhost:3000/api/comments/${this.commentId}`, {
                method: 'DELETE'
            })
            .then(() => {
                alert('Le commentaire a bien été supprimée.');
                this.$router.push({ name: 'Posts'});
            })
            .catch(err => console.log('Error deleteComment', err));
        },
        modConditions() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            if(currentUserId == this.userId) {
                return true;
            } else {
                return false;
            }
        },
        modConditionsAndAdmin() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            fetch(`http://localhost:3000/api/users/${currentUserId}`)
            .then(res => {
                const result = JSON.parse(res.json());
                if(result.admin) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(err => console.log('Error ModConditionsAndAdmin', err));
        }
    }
}
</script>

<style>

</style>