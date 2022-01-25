<template>
    <div class="published-comment">
        <h3 v-if="loadName">{{ userName }}</h3>
        <p class="comment" v-if="!modifyClicked">{{ comment }}</p>
        <textarea v-if="modifyClicked" name="textarea" v-model="comment"></textarea>
        <div class="like-date">
            <div v-if="likesChecked">
                <button @click="likeClicked" v-if="liked" class="liked"><fa icon="thumbs-up" alt="Icone de like"/>{{ shownLikeNumber }}</button>
                <button @click="likeClicked" v-if="!liked" class="not-liked"><fa icon="thumbs-up" alt="Icone de like"/>{{ shownLikeNumber }}</button>
                <button @click="dislikeClicked" v-if="disliked" class="liked"><fa icon="thumbs-down" alt="Icone de dislike"/>{{ shownDislikeNumber }}</button>
                <button @click="dislikeClicked" v-if="!disliked" class="not-liked"><fa icon="thumbs-down" alt="Icone de dislike"/> {{ shownDislikeNumber }}</button>
            </div>
            <p>{{ date }}</p>
        </div>
        <p id="likeErrorMessageComment"></p>
        <div class="modify-buttons">
            <button v-if="modifyClicked" @click="modifyComment">Publier</button>
            <button v-if="displayButtons && !modifyClicked" @click="modifyButton">Modifier</button>
            <button v-if="displayButtons || displayButtonsAdmin" @click="deleteComment">Supprimer</button>
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
            liked: this.hasTheUserAlreadyLiked(),
            disliked: false,
            modifyClicked: false,
            shownLikeNumber: this.likeNumber,
            shownDislikeNumber: this.dislikeNumber,
            userName: this.getUserName(this.userId),
            loadName: false,
            displayButtons: this.modConditions(),
            displayButtonsAdmin: this.modConditionsAndAdmin(),
            likesChecked: false,
        }
    },
    methods: {
        /**
         * Find and display the name of a user from its id
         */
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
        /**
         * Find wether the user has already liked or disliked the comment
         */
        hasTheUserAlreadyLiked() {
            //First we find the comment in the database
            const currentUserId = localStorage.getItem('currentUserId');
            fetch(`http://localhost:3000/api/comments/${this.commentId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                const likeList = result.usersLike;
                const dislikeList = result.usersDislike;
                //Assign true to liked when the user has liked the comment
                if(likeList != []) {
                    for(let userId of likeList) {
                        if(currentUserId == userId) {
                            this.likesChecked = true;
                            return this.liked = true;
                        }
                    }
                }
                //Assign true to disliked when the user has disliked the comment
                if(dislikeList != []) {
                    for(let userId of dislikeList) {
                        if(currentUserId == userId) {
                            this.likesChecked = true;
                            return this.disliked = true;
                        }
                    }
                }
                //Return false when the user hasn't liked or disliked the comment
                this.likesChecked = true;
                return this.liked = false;
            
            })
            .catch(error => {
                console.log('Error hasTheUserAlreadyLiked', error);
                alert('Une erreur s\'est produite');
            })
        },
        /**
         * Modify the info of the comment in the database when the like button is clicked
         */
        likeClicked() {
            //When the user hasn't already liked or disliked the comment, we record their like in the database
            if(!this.liked && !this.disliked) {
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
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = 'Vous ne pouvez pas liker cette publication.';
                    } else {
                        //We modify the number of likes displayed 
                        this.shownLikeNumber++;
                        this.liked = true;
                        this.hasTheUser = 'liked';
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => {
                    console.log('Error likeClicked', err);
                    alert('Une erreur s\'est produite');
                });
            //When the user has already liked the comment, we modify the database to delete their like
            } else if(this.liked && !this.disliked) {
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
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = 'Vous ne pouvez pas déliker cette publication.';
                    } else {
                        //We modify the number of liked displayed
                        this.shownLikeNumber--;
                        this.liked = false;
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => {
                    console.log('Error likeClicked', err);
                    alert('Une erreur s\'est produite');
                });
            } else {
                const messagePlace = document.getElementById('likeErrorMessage');
                messagePlace.innerText = 'Vous ne pouvez pas liker cette publication.';
            }
        },
        /**
         * Modify the info of the comment in the database when the dislike button is clicked
         */
        dislikeClicked() {
            //When the user hasn't already liked or disliked the comment, we record their dislike in the database
            if(!this.liked && !this.disliked) {
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
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = 'Vous ne pouvez pas disliker cette publication.';
                    } else {
                        //We modify the number of dislikes displayed
                        this.shownDislikeNumber++;
                        this.disliked = true;
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => {
                    console.log('Error dislikeClicked', err);
                    alert('Une erreur s\'est produite');
                });
            //When the user has already disliked the comment, we modify the database to delete their dislike
            } else if(this.disliked && !this.liked) {
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
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = 'Vous ne pouvez pas dédisliker cette publication.';
                    } else {
                        //We modify the number of dislikes displayed
                        this.shownDislikeNumber--;
                        this.disliked = false;
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => {
                    console.log('Error dislikeClicked', err);
                    alert('Une erreur s\'est produite');
                });
            } else {
                const messagePlace = document.getElementById('likeErrorMessage');
                messagePlace.innerText = 'Vous ne pouvez pas disliker cette publication.';
            }
        },
        /**
         * Assign true to modifyClicked when the modify button is clicked
         */
        modifyButton() {
            this.modifyClicked = true;
        },
        /**
         * Modify the comment in the database
         */
        modifyComment() {
            if(this.comment) {
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
                    alert('Le commentaire a bien été modifiée!');
                    //We pass the new comment to the payload, so we can change it in the array of comment displayed in the mother component
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
            } else {
                alert('Pour modifier votre commentaire, verifiez d\'avoir écrit dans le champs de saisie')
            }
        },
        /**
         * Delete the comment from the database, and stop displaying it
         */
        deleteComment() {
            fetch(`http://localhost:3000/api/comments/${this.commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(() => {
                alert('Le commentaire a bien été supprimée.');
                //We pass the id of the comment in the payload to delete it from the array of comments displayed in the mother component
                this.$emit('comment-deleted', {
                    id: this.commentId
                })
            })
            .catch(err => {
                console.log('Error deleteComment', err);
                alert('Une erreur s\'est produite');
            });
        },
        /**
         * Verify if the current user viewing the comment is the creator of the comment, therefore if they can modify or delete the comment
         */
        modConditions() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            if(currentUserId == this.userId) {
                return this.displayButtons = true;
            } else {
                return this.displayButtons = false;
            }
        },
        /**
         * Verify if the current user viewing the comment is an admin and therefore can delete the comment
         */
        modConditionsAndAdmin() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            fetch(`http://localhost:3000/api/users/${currentUserId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                //Admin is stored ad a BITTYPE, aka, returns 0 or 1 instead of false and true
                if(parseInt(result.admin.data[0], 10)) {
                    return this.displayButtonsAdmin = true;
                } else {
                    return this.displayButtonsAdmin = false;
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

<style lang="scss">
div.published-comment {
    display: flex;
    flex-direction: column;
    background-color: #D0F7C5;
    width: 85%;
    margin-top: 2em;
    border-radius: 15px/15px;
    padding-left: 0.75em;
    padding-right: 00.75em;
    padding-bottom: 1em;
    min-width: fit-content;
    &>h3 {
        font-size: 1.1em;
        color: #4C061D;
    }
    &>p.comment {
        background-color: white;
        border: #92D5E6 solid 2px;
        width: 95%;
        white-space: pre-wrap;
        padding: 0.75em 0.5em;
        align-self: center;
        font-size: 1em;
    }
    &>textarea {
        border: solid 2px #92D5E6;
        border-radius: 15px/15px;
        font-size: 1em;
        margin-bottom: 00.5em;
    
    }
    &>div.like-date {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 1em;
        &>div {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 10%;
            max-width: 6em;
            justify-content: space-between;
            &>button{
                align-self: center;
                border-radius: 15px/15px;
                box-shadow: 2px 2px 3px #0E4749;
                padding: 0.25em 0.5em;
                margin-right: 0.25em;
                min-width: fit-content;
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 1em;
                width: 2.5em;
                height: 2.5em;
                cursor: pointer;
                &.liked {
                    background-color: #4C061D;
                    color: white;
                }
                &.not-liked {
                    background-color: white;
                    color: black;
                    border: #92D5E6 solid 1px;
                }
                
            }
        }
    }
    &>div.modify-buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
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
}
</style>