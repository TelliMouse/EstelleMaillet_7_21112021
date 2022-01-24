<template>
    <div class="published-post">
        <h1 v-if="!modifyClicked">{{ postTitle }}</h1>
        <input v-if="modifyClicked" type="text" id="changeTitle" v-model="modelTitle"/>

        <h2 v-if="loadName">{{ userName }}</h2>

        <p class="post-text" v-if="textPost && !modifyClicked">{{ post }}</p>
        <textarea v-if="textPost && modifyClicked" name="textarea" rows="5" cols="30" v-model="modelPost"></textarea>

        <img v-if="imagePost && !modifyClicked" :src="imageUrl" :alt="imageAlt"/>

        <label v-if="imagePost && modifyClicked" for="changeImagePost">Si vous souhaitez changer votre image, choisissez un nouveau fichier:</label>
        <input v-if="imagePost && modifyClicked" @input="addFile" type="file" name="image" id="changeImagePost" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg+xml"/>
        <label v-if="imagePost && modifyClicked" for="changeImageAlt">Si vous avez changé votre image, veuillez la décrire en quelques mots:</label>
        <input v-if="imagePost && modifyClicked" type="text" name="image" id="changeImageUrl" placeholder="Exemple: Photographie d'une colline verdoyante devant un ciel bleu sans nuage" v-model="modelImageAlt"/>
        <p v-if="imagePost && modifyClicked">Avoir des textes alternatifs pour vos images permet d'avoir un contenu plus accessible pour les personnes malvoyantes</p>
        <div class="like-date">
            <div v-if="likesChecked">
                <button @click="likeClicked" v-if="liked" class="liked"><fa icon="thumbs-up" alt="Icone de like"/>{{ shownLikeNumber }}</button>
                <button @click="likeClicked" v-if="!liked" class="not-liked"><fa icon="thumbs-up" alt="Icone de like"/>{{ shownLikeNumber }}</button>
                <button @click="dislikeClicked" v-if="disliked" class="liked"><fa icon="thumbs-down" alt="Icone de dislike"/>{{ shownDislikeNumber }}</button>
                <button @click="dislikeClicked" v-if="!disliked" class="not-liked"><fa icon="thumbs-down" alt="Icone de dislike"/> {{ shownDislikeNumber }}</button>
            </div>
            <p>{{ date }}</p>
        </div>
        <p id="likeErrorMessage"></p>
        <button v-if="modifyClicked" @click="modifyPost">Publier</button>
        <div class="modify-buttons">
            <button v-if="displayButtons && !modifyClicked" @click="modifyButton">Modifier</button>
            <button v-if="displayButtons || displayButtonsAdmin" @click="deletePost">Supprimer</button>
        </div>
        <router-link :to="{ name: 'Post', params: { id: postId } }" v-if="needLinkToPost">Voir la publication</router-link>
    </div>
</template>

<script>
export default {
    name: 'PublishedPost',
    props: {
        postTitle: String,
        postTextPost: Boolean,
        post: String,
        imageUrl: String,
        imageAlt: String,
        likeNumber: Number,
        dislikeNumber: Number,
        date: String,
        postId: Number,
        postModConditions: Boolean,
        postImagePost: Boolean,
        userId: Number, //id of the user who made the post
        postNeedLinkToPost: Boolean
    },
    data() {
        return {
            modifyClicked: false,
            textPost: this.postTextPost,
            imagePost: this.postImagePost,
            files: '',
            modelTitle: this.postTitle,
            modelPost: this.post,
            modelImageAlt: this.imageAlt,
            liked: this.hasTheUserAlreadyLiked(),
            disliked: false,
            needLinkToPost: this.postNeedLinkToPost,
            shownLikeNumber: this.likeNumber,
            shownDislikeNumber: this.dislikeNumber,
            likeList: [],
            dislikeList: [],
            displayButtons: this.modConditions(),
            displayButtonsAdmin: this.modConditionsAndAdmin(),
            userName: this.getUserName(this.userId),
            loadName: false,
            likesChecked: false
        }
    },
    methods: {
        /**
         * Display the name of the user who made the post
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
         * Verify if the user has already liked or disliked the post
         */
        hasTheUserAlreadyLiked() {
            //First we find the post in the database
            const currentUserId = localStorage.getItem('currentUserId');
            fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                const likeList = result[0].usersLike;
                const dislikeList = result[0].usersDislike;
                //Assign true to liked when the user has liked the post
                if(likeList != []) {
                    for(let userId of likeList) {
                        if(currentUserId == userId) {
                            this.likesChecked = true;
                            return this.liked = true;
                        }
                    }
                }
                //Assign true to disliked when the user has disliked the post
                if(dislikeList != []) {
                    for(let userId of dislikeList) {
                        if(currentUserId == userId) {
                            this.likesChecked = true;
                            return this.disliked = true;
                        }
                    }
                }
                //Return false when the user hasn't liked or disliked the post 
                this.likesChecked = true;
                return this.liked = false;
            })
            .catch(error => {
                console.log('Error hasTheUserAlredyLiked', error);
                alert('Une erreur s\'est produite');
            })
        },
        /**
         * Modify the info of the post in the database when the like button is clicked
         */
        likeClicked() {
            //When the user hasn't already liked or disliked the post, we record their like in the database
            if(!this.liked && !this.disliked) {
                fetch(`http://localhost:3000/api/posts/${this.postId}/like`, {
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
            //When the user has already liked the post, we modify the database to delete their like
            } else if(this.liked && !this.disliked) {
                fetch(`http://localhost:3000/api/posts/${this.postId}/like`, {
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
                        this.hasTheUser = false;
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
         * Modify the info of the post in the database when the dislike button is clicked
         */
        dislikeClicked() {
            //When the user hasn't already liked or disliked the post, we record their dislike in the database
            if(!this.liked && !this.disliked) {
                fetch(`http://localhost:3000/api/posts/${this.postId}/like`, {
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
                        this.hasTheUser = 'disliked';
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => {
                    console.log('Error dislikeClicked', err);
                    alert('Une erreur s\'est produite');
                });
            //When the user has already disliked the post, we modify the database to delete their dislike
            } else if(this.disliked && !this.liked) {
                fetch(`http://localhost:3000/api/posts/${this.postId}/like`, {
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
                        this.hasTheUser = false;
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
         * Assign the input's files to files, so it can return a truthy value, or null
         */
        addFile() {
            const input = document.getElementById('changeImagePost');
            this.files = input.files
        },
        /**
         * Modify the post in the database
         */
        modifyPost() {
            if(this.modelTitle) {
                if(this.modelPost || this.files) {
                    if(this.files && !this.modelImageAlt) {
                        alert('Veuillez décrire votre image avant de modifier votre publication');
                    } else {
                        const modifiedPost = {
                            title: this.modelTitle,
                            user_id: this.userId,
                            text: this.modelPost,
                            imageAlt: this.modelImageAlt
                        };
                        //We need to treat request differently wether it has an image attached or not.
                        //We use FormData to attach the file to the request
                        if(this.files) {
                            const input = document.getElementById('changeImagePost');
                            const data = new FormData();
                            data.append('image', input.files[0]);
                            data.append('json', JSON.stringify(modifiedPost));
                            fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                                method: 'PUT',
                                credentials: 'include',
                                headers: {
                                "Accept": "application/json",
                                },
                                body: data
                            })
                            .then(res => res.json())
                            .then(result => {
                                if(!result || result.error) {
                                    alert('Une erreur s\'est produite');
                                } else {
                                    alert('La publication a bien été modifiée!')
                                    this.$emit('post-modified');
                                    this.modifyClicked = false;
                                }
                            })
                            .catch(err => {
                                console.log('Error modifyPost', err);
                                alert('Une erreur s\'est produite');
                            })
                        } else {
                            fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                                method: 'PUT',
                                credentials: 'include',
                                headers: {
                                "Accept": "application/json", 
                                "Content-Type": "application/json"
                                },
                                body: JSON.stringify(modifiedPost)
                            })
                            .then(res => res.json())
                            .then(result => {
                                if(!result || result.error) {
                                    alert('Une erreur s\'est produite');
                                } else {
                                    alert('La publication a bien été modifiée!')
                                    this.$emit('post-modified');
                                    this.modifyClicked = false;
                                }
                            })
                            .catch(err => {
                                console.log('Error modifyPost', err);
                                alert('Une erreur s\'est produite');
                            })
                        }
                    }
                } else {
                    alert('Veuillez remplir tous les champs de saisie avant de modifier votre publication');
                }
            } else {
                alert('Veuillez remplir tous les champs de saisie avant de modifier votre publication');
            } 
        },
        /**
         * Delete the post from the database, and redirects to the main page
         */
        deletePost() {
            fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => res.json())
                .then(result => {
                    if(!result) {
                        alert('Une erreur s\'est produite');
                    } else {
                        alert('La publication a bien été supprimée!')
                        this.$router.push({ name: 'Posts', params: { page: 1 } });
                    }
                })
            .catch(err => {
                console.log('Error deletePost', err);
                alert('Une erreur s\'est produite');
            });
        },
        /**
         * Verify if the current user viewing the post is the creator of the post, therefore if they can modify or delete the post
         */
        modConditions() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            if(currentUserId == this.userId && this.postModConditions) {
                return this.displayButtons = true;
            } else {
                return this.displayButtons = false;
            }
        },
        /**
         * Verify if the current user viewing the post is an admin and therefore can delete the post
         */
        modConditionsAndAdmin() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            fetch(`http://localhost:3000/api/users/${currentUserId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                if(parseInt(result.admin.data[0], 10) && this.postModConditions) {
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
div.published-post {
    display: flex;
    flex-direction: column;
    background-color: #D3F6DB;
    width: 85%;
    margin-top: 2em;
    border-radius: 15px/15px;
    padding-top: 0.75em;
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 1.25em;
    &>h1 {
        margin-top: 0;
        font-size: 2em;
    }
    &>p.post-text {
        background-color: white;
        border: #92D5E6 solid 2px;
        width: 95%;
        white-space: pre-wrap;
        padding: 0.75em 0.5em;
        align-self: center;
    }
    &>h2 {
        color: #4C061D;
        font-size: 1.3em;
    }
    &>img {
        width: 95%;
        border: #92D5E6 solid 3px;
        align-self: center;
    }
    &>div.like-date {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        &>div {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 10%;
            justify-content: space-between;
            &>button{
                align-self: center;
                border-radius: 15px/15px;
                border: #92D5E6 solid 1px;
                box-shadow: 2px 2px 3px #0E4749;
                padding: 0.25em 0.5em;
                margin-right: 0.25em;
                &.liked {
                    background-color: #A1EF8B;
                    color: black;
                }
                &.not-liked {
                    background-color: white;
                    color: black;
                }
                
            }
        }
    }
    &>div.modify-buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        &>button {
            color: #002626;
            border-radius: 15px/15px;
            border: #002626 solid 1px;
            box-shadow: solid 2px 2px 3px #0E4749;
            padding: 0.5em 0.75em;
        }
    }
}


</style>