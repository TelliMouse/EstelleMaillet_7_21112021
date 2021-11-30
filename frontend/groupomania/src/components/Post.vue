<template>
    <div>
        <h1 v-if="!modifyClicked">{{ postTitle }}</h1>
        <input v-if="modifyClicked" type="text" id="changeTitle" v-model="modelTitle"/>

        <h2>{{ userName }}</h2>

        <p v-if="textPost && !modifyClicked">{{ post }}</p>
        <textarea v-if="textPost && modifyClicked" name="textarea" rows="5" cols="30" v-model="modelPost"></textarea>

        <img v-if="imagePost && !modifyClicked" src="{{ imageUrl }}" alt="{{ imageAlt }}"/>

        <label v-if="imagePost && modifyClicked" for="changeImagePost">Si vous souhaitez changer votre image, choisissez un nouveau fichier:</label>
        <input v-if="imagePost && modifyClicked" @input="addFile" type="file" name="image" id="changeImagePost" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg+xml"/>
        <label v-if="imagePost && modifyClicked" for="changeImageAlt">Si vous avez changé votre image, veuillez la décrire en quelques mots:</label>
        <input v-if="imagePost && modifyClicked" type="text" name="image" id="changeImageUrl" placeholder="Exemple: Photographie d'une colline verdoyante devant un ciel bleu sans nuage" v-model="modelImageAlt"/>
        <p v-if="imagePost && modifyClicked">Avoir des textes alternatifs pour vos images permet d'avoir un contenu plus accessible pour les personnes malvoyantes</p>
        <div>
            <div>
                <button @click="likeClicked"><img v-if="liked" src="../assets/thumbs-up-solid.svg" alt="Icone de like"/><img v-if="!liked" src="../assets/thumbs-up-solid.svg" alt="Icone de like"/> {{ likeNumber }}</button>
                <button @click="dislikeClicked"><img v-if="disliked" src="../assets/thumbs-down-solid.svg" alt="Icon de dislike"/><img v-if="!disliked" src="../assets/thumbs-down-solid.svg" alt="Icon de dislike"/> {{ dislikeNumber }}</button>
            </div>
            <p>{{ date }}</p>
        </div>
        <p id="likeErrorMessage"></p>
        <button v-if="modifyClicked" @click="modifyPost">Publier</button>
        <div>
            <button v-if="modConditions" @click="modifyButton">Modifier</button>
            <button v-if="modConditions || modConditionsAndAdmin" @click="deletePost">Supprimer</button>
            <input/>
        </div>
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
        userId: Number //id of the user who made the post
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
            liked: false,
            disliked: false
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
                this.liked = true;
            }
        },
        isDisliked() {
            if(this.hasTheUserAlreadyLiked() === 'disliked') {
                this.disliked = true;
            }
        },
        likeClicked() {
            if(this.hasTheUserAlreadyLiked() === false) {
                fetch(`http://localhost:3000/api/${this.postId}`, {
                    method: POST,
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
                    this.likeNumber++;
                    this.liked = true;
                })
                .catch(err => console.log('Error likeClicked', err));
            } else if(this.hasTheUserAlreadyLiked() === 'liked') {
                fetch(`http://localhost:3000/api/${this.postId}`, {
                    method: POST,
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
                    this.likeNumber--;
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
                fetch(`http://localhost:3000/api/${this.postId}`, {
                    method: POST,
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
                    this.dislikeNumber++;
                    this.disliked = true;
                })
                .catch(err => console.log('Error dislikeClicked', err));
            } else if(this.hasTheUserAlreadyLiked() === 'disliked') {
                fetch(`http://localhost:3000/api/${this.postId}`, {
                    method: POST,
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
                    this.dislikeNumber--;
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
                fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                    method: 'PUT',
                    headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({post: modifiedPost}),
                    file: this.files
                })
                .then(() => {
                    alert('La publication a bien été modifiée!')
                    this.$router.push({ name: 'Posts'});
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
                .then(() => {
                    alert('La publication a bien été modifiée!')
                    this.$router.push({ name: 'Posts'});
                })
                .catch(err => console.log('Error modifyPost', err))
            }
        },
        deletePost() {
            fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                method: 'DELETE'
            })
            .then(() => {
                alert('La publication a bien été supprimée.');
                this.$router.push({ name: 'Posts'});
            })
            .catch(err => console.log('Error deletePost', err));
        },
        modConditions() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            if(currentUserId == this.postId && this.postModConditions) {
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

<style>

</style>