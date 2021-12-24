<template>
    <div class="published-post">
        <h1 v-if="!modifyClicked">{{ postTitle }}</h1>
        <input v-if="modifyClicked" type="text" id="changeTitle" v-model="modelTitle"/>

        <h2>{{ userName }}</h2>

        <p class="post-text" v-if="textPost && !modifyClicked">{{ post }}</p>
        <textarea v-if="textPost && modifyClicked" name="textarea" rows="5" cols="30" v-model="modelPost"></textarea>

        <img v-if="imagePost && !modifyClicked" :src="imageUrl" :alt="imageAlt"/>

        <label v-if="imagePost && modifyClicked" for="changeImagePost">Si vous souhaitez changer votre image, choisissez un nouveau fichier:</label>
        <input v-if="imagePost && modifyClicked" @input="addFile" type="file" name="image" id="changeImagePost" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg+xml"/>
        <label v-if="imagePost && modifyClicked" for="changeImageAlt">Si vous avez changé votre image, veuillez la décrire en quelques mots:</label>
        <input v-if="imagePost && modifyClicked" type="text" name="image" id="changeImageUrl" placeholder="Exemple: Photographie d'une colline verdoyante devant un ciel bleu sans nuage" v-model="modelImageAlt"/>
        <p v-if="imagePost && modifyClicked">Avoir des textes alternatifs pour vos images permet d'avoir un contenu plus accessible pour les personnes malvoyantes</p>
        <div>
            <div>
                <button @click="likeClicked"><fa icon="thumbs-up" v-if="liked" alt="Icone de like"/><fa icon="thumbs-up" v-if="!liked" alt="Icone de like"/> {{ shownLikeNumber }}</button>
                <button @click="dislikeClicked"><fa icon="thumbs-down" v-if="disliked" alt="Icone de dislike"/><fa icon="thumbs-down" v-if="!disliked" alt="Icone de dislike"/> {{ shownDislikeNumber }}</button>
            </div>
            <p>{{ date }}</p>
        </div>
        <p id="likeErrorMessage"></p>
        <button v-if="modifyClicked" @click="modifyPost">Publier</button>
        <div>
            <button v-if="modConditions" @click="modifyButton">Modifier</button>
            <button v-if="modConditions || modConditionsAndAdmin" @click="deletePost">Supprimer</button>
        </div>
        <router-link to="{{ linkToPost }}" v-if="needLinkToPost">Voir la publication</router-link>
    </div>
</template>

<script>
export default {
    name: 'Post',
    props: {
        postTitle: String,
        postTextPost: Boolean,
        userName: String,
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
        linkToPost: String,
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
            liked: this.isLiked(),
            disliked: this.isDisliked(),
            needLinkToPost: this.postNeedLinkToPost,
            shownLikeNumber: this.likeNumber,
            shownDislikeNumber: this.dislikeNumber
        }
    },
    methods: {
        hasTheUserAlreadyLiked() {
            const currentUserId = localStorage.getItem('currentUserId');

            fetch(`http://localhost:3000/api/posts/${this.postId}`)
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
                fetch(`http://localhost:3000/api/posts/${this.postId}/like`, {
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
                fetch(`http://localhost:3000/api/posts/${this.postId}/like`, {
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
                messagePlace.innerText = 'Vous ne pouvez pas liker cette publication.'
            }
        },
        dislikeClicked() {
            if(this.hasTheUserAlreadyLiked() === false) {
                fetch(`http://localhost:3000/api/posts/${this.postId}/like`, {
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
                fetch(`http://localhost:3000/api/posts/${this.postId}/like`, {
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
                    this.shownDislikeNumber--;
                    this.disliked = false;
                })
                .catch(err => console.log('Error dislikeClicked', err));
            } else {
                const messagePlace = document.getElementById('likeErrorMessage');
                messagePlace.innerText = 'Vous ne pouvez pas disliker cette publication.'
            }
        },
        modifyButton() {
            this.modifyClicked = true;
        },
        addFile() {
            const input = document.getElementById('changeImagePost');
            this.files = input.files
        },
        modifyPost() {
            const modifiedPost = {
                title: this.postTitle,
                user_id: this.userId,
                text: this.post,
                imageAlt: this.imageAlt
            };
            if(this.files) {
                const input = document.getElementById('changeImagePost');
                const data = new FormData();
                data.append('image', input.files[0]);
                data.append('json', JSON.stringify(modifiedPost));
                fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                    method: 'PUT',
                    headers: {
                    "Accept": "application/json",
                    },
                    body: data
                })
                .then(res => res.json())
                .then(result => {
                    if(!result) {
                        alert('Une erreur s\'est produite');
                    } else {
                        alert('La publication a bien été modifiée!')
                        this.$forceUpdate();
                    }
                })
                .catch(err => console.log('Error modifyPost', err))
            } else {
                fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                    method: 'PUT',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify(modifiedPost)
                })
                .then(res => res.json())
                .then(result => {
                    if(!result) {
                        alert('Une erreur s\'est produite');
                    } else {
                        alert('La publication a bien été modifiée!')
                        this.$forceUpdate();
                    }
                })
                .catch(err => console.log('Error modifyPost', err))
            }
        },
        deletePost() {
            fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
                .then(result => {
                    if(!result) {
                        alert('Une erreur s\'est produite');
                    } else {
                        alert('La publication a bien été supprimée!')
                        this.$forceUpdate();
                    }
                })
            .catch(err => console.log('Error deletePost', err));
        },
        modConditions() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            if(currentUserId == this.userId && this.postModConditions) {
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
                if(result.admin && this.postModConditions) {
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

<style lang="scss">
div.published-post {
    background-color: #BBC8CA;
    border-radius: 15px/15px;
    margin-bottom: 2em;
    padding: 1em 0.75em 1.5em 0.75em;
    width: 70%;
    &>h1 {
        margin-top: 0;
        size: 2em;
    }
    &>p.post-text {
        background-color: white;
        border: #3F826D solid 2px;
        width: 90%;
        white-space: pre-wrap;
        padding: 0.75em 0.5em;
        align-self: center;
    }
    &>h2 {
        color: #3F826D;
    }
    &>img {
        width: 95%;
        border: #3F826D solid 3px;
    }
}


</style>