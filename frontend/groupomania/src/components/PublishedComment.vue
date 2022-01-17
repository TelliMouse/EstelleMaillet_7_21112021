<template>
    <div>
        <h3 v-if="loadName">{{ userName }}</h3>
        <p v-if="!modifyClicked">{{ comment }}</p>
        <textarea v-if="modifyClicked" name="textarea" v-model="comment"></textarea>
        <div>
            <div>
                <button @click="likeClicked"><fa icon="thumbs-up" v-if="liked" alt="Icone de like"/><fa icon="thumbs-up" v-if="!liked" alt="Icone de like"/> {{ shownLikeNumber }}</button>
                <button @click="dislikeClicked"><fa icon="thumbs-down" v-if="disliked" alt="Icone de dislike"/><fa icon="thumbs-down" v-if="!disliked" alt="Icone de dislike"/> {{ shownDislikeNumber }}</button>
            </div>
            <p>{{ date }}</p>
        </div>
        <p id="likeErrorMessageComment"></p>
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
            shownDislikeNumber: this.dislikeNumber,
            userName: this.getUserName(this.userId),
            loadName: false,
            hasTheUser: this.hasTheUserAlreadyLiked()
        }
    },
    methods: {
        getUserName(userId) {
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
        hasTheUserAlreadyLiked() {
            const currentUserId = localStorage.getItem('currentUserId');
            fetch(`http://localhost:3000/api/comments/${this.commentId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                const likeList = result[0].usersLike;
                const dislikeList = result[0].usersDislike;
                if(likeList != []) {
                    for(let userId of likeList) {
                        if(currentUserId == userId) {
                            return this.hasTheUser = 'liked';
                        }
                    }
                }

                if(dislikeList != []) {
                    for(let userId of dislikeList) {
                        if(currentUserId == userId) {
                            return this.hasTheUser = 'disliked';
                        }
                    }
                }

                return this.hasTheUser = false
            
            })
            .catch(error => {
                console.log('Error hasTheUserAlreadyLiked', error);
                alert('Une erreur s\'est produite');
                })
        },
        isLiked() {
            if(this.hasTheUser === 'liked') {
                return this.liked = true;
            } else {
                return this.liked = false;
            }
        },
        isDisliked() {
            if(this.hasTheUser === 'disliked') {
                return this.disliked = true;
            } else {
                return this.disliked = false;
            }
        },
        likeClicked() {
            if(this.hasTheUser === false) {
                fetch(`http://localhost:3000/api/comments/${this.commentId}/like`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: JSON.parse(localStorage.getItem('currentUserId')),
                        like: 1
                    })
                })
                .then(res => res.json())
                .then(result => {
                    if(result == {message: 'The user cannot like/dislike the post'}) {
                        const messagePlace = document.getElementById('likeErrorMessageComment');
                        messagePlace.innerText = 'Vous ne pouvez pas liker cette publication.';
                    } else {
                        this.shownLikeNumber++;
                        this.liked = true;
                        this.hasTheUser = 'liked';
                        const messagePlace = document.getElementById('likeErrorMessageComment');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => {
                    console.log('Error likeClicked', err);
                    alert('Une erreur s\'est produite');
                    });
            } else if(this.hasTheUser === 'liked') {
                fetch(`http://localhost:3000/api/comments/${this.commentId}/like`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: JSON.parse(localStorage.getItem('currentUserId')),
                        like: 0
                    })
                })
                .then(res => res.json())
                .then(result => {
                    if(result == {message: 'The user cannot like/dislike the post'}) {
                        const messagePlace = document.getElementById('likeErrorMessageComment');
                        messagePlace.innerText = 'Vous ne pouvez pas déliker cette publication.';
                    } else {
                        this.shownLikeNumber--;
                        this.liked = false;
                        this.hasTheUser = false;
                        const messagePlace = document.getElementById('likeErrorMessageComment');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => {
                    console.log('Error likeClicked', err);
                    alert('Une erreur s\'est produite');
                    });
            } else {
                const messagePlace = document.getElementById('likeErrorMessageComment');
                messagePlace.innerText = 'Vous ne pouvez pas liker ce commentaire.'
            }
        },
        dislikeClicked() {
            if(this.hasTheUser === false) {
                fetch(`http://localhost:3000/api/comments/${this.commentId}/like`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: JSON.parse(localStorage.getItem('currentUserId')),
                        like: -1
                    })
                })
                .then(res => res.json())
                .then(result => {
                    if(result == {message: 'The user cannot like/dislike the post'}) {
                        const messagePlace = document.getElementById('likeErrorMessageComment');
                        messagePlace.innerText = 'Vous ne pouvez pas disliker cette publication.';
                    } else {
                        this.shownDislikeNumber++;
                        this.disliked = true;
                        this.hasTheUser = 'disliked';
                        const messagePlace = document.getElementById('likeErrorMessageComment');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => {
                    console.log('Error dislikeClicked', err);
                    alert('Une erreur s\'est produite');
                    });
            } else if(this.hasTheUser === 'disliked') {
                fetch(`http://localhost:3000/api/comments/${this.commentId}/like`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: JSON.parse(localStorage.getItem('currentUserId')),
                        like: 0
                    })
                })
                .then(res => res.json())
                .then(result => {
                    if(result == {message: 'The user cannot like/dislike the post'}) {
                        const messagePlace = document.getElementById('likeErrorMessageComment');
                        messagePlace.innerText = 'Vous ne pouvez pas dédisliker cette publication.';
                    } else {
                        this.shownDislikeNumber--;
                        this.disliked = false;
                        this.hasTheUser = false;
                        const messagePlace = document.getElementById('likeErrorMessageComment');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => {
                    console.log('Error dislikeClicked', err);
                    alert('Une erreur s\'est produite');
                    });
            } else {
                const messagePlace = document.getElementById('likeErrorMessageComment');
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
                credentials: 'include',
                headers: {
                "Accept": "application/json", 
                "Content-Type": "application/json"
                },
                body: JSON.stringify(modifiedComment)
            })
            .then(() => {
                alert('Le commentaire a bien été modifiée!')
                this.$emit('comment-modified', {
                    id: this.commentId,
                    text: this.comment
                });
                this.modifyClicked = false;
            })
            .catch(err => {
                console.log('Error modifyComment', err);
                alert('Une erreur s\'est produite');
                })
        },
        deleteComment() {
            fetch(`http://localhost:3000/api/comments/${this.commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(() => {
                alert('Le commentaire a bien été supprimée.');
                this.$emit('comment-deleted', {
                    id: this.commentId
                })
            })
            .catch(err => {
                console.log('Error deleteComment', err);
                alert('Une erreur s\'est produite');
                });
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
            fetch(`http://localhost:3000/api/users/${currentUserId}`, {
                credentials: 'include'
            })
            .then(res => {
                const result = JSON.parse(res.json());
                if(result.admin) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(err => {
                console.log('Error ModConditionsAndAdmin', err);
                alert('Une erreur s\'est produite');
                });
        }
    }
}
</script>

<style>

</style>