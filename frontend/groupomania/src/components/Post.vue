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
            <div>
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
            <button v-if="displayButtons" @click="modifyButton">Modifier</button>
            <button v-if="displayButtons || displayButtonsAdmin" @click="deletePost">Supprimer</button>
        </div>
        <router-link :to="{ name: 'Post', params: { id: postId}}" v-if="needLinkToPost">Voir la publication</router-link>
    </div>
</template>

<script>
export default {
    name: 'Post',
    props: {
        postTitle: String,
        postTextPost: Boolean,
        //userName: String,
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
        postNeedLinkToPost: Boolean,
        //loadName: Boolean
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
            shownDislikeNumber: this.dislikeNumber,
            likeList: [], //this.getLikeList(),
            dislikeList: [], //this.getDislikeList()
            hasTheUser: this.hasTheUserAlreadyLiked(),
            displayButtons: this.modConditions(),
            displayButtonsAdmin: this.modConditionsAndAdmin(),
            userName: this.getUserName(this.userId),
            loadName: false
        }
    },
    methods: {
        getUserName(userId) {
            console.log('getUserName');
            fetch(`http://localhost:3000/api/users/${userId}`)
            .then(res => res.json())
            .then(result => {
                //const users = [];
                const firstname = result.firstname;
                const lastname = result.lastname;
                //console.log(firstname, lastname);
                //this.users = firstname + ' ' + lastname;
                this.loadName = true;
                return this.userName = firstname + ' ' + lastname;
            })
            .catch(err => console.log('Error getUserName', err));
        },
        /*getLikeList() {
            console.log('getlikelist');
            fetch(`http://localhost:3000/api/posts/${this.postId}`)
            .then(res => res.json())
            .then(result => {
                console.log('result getlikelist: ', result);
                this.likeList = result[0].usersLike;
                //console.log('result: ', result);
                //console.log('likelist: ', this.likeList)
            })
            .catch(err => console.log('Error hasTheUserAlreadyLiked', err));
        },
        getDislikeList() {
            console.log('getdislikelist');
            fetch(`http://localhost:3000/api/posts/${this.postId}`)
            .then(res => res.json())
            .then(result => {
                this.dislikeList = result[0].usersDisike;
                //console.log('dislikelist: ', this.dislikeList)
            })
            .catch(err => console.log('Error hasTheUserAlreadyLiked', err));
        },*/
        hasTheUserAlreadyLiked() {
            console.log('hastheuseralreadyliked');
            const currentUserId = localStorage.getItem('currentUserId');

            //console.log('likelist: ', this.likeList);
            //console.log('dislikelist: ', this.dislikeList);

            /*if(this.likeList != []) {
                for(let userId of this.likeList) {
                    console.log('iteration hastheuserliked');
                    if(currentUserId == userId) {
                        console.log('hastheuser liked');
                        return 'liked';
                    }
                }
            }

            if(this.dislikeList != []) {
                for(let userId of this.dislikeList) {
                    if(currentUserId == userId) {
                        console.log('hastheuser disliked');
                        return 'disliked';
                    }
                }
            }

            console.log('hastheuser: ', false);
            return false;*/
            fetch(`http://localhost:3000/api/posts/${this.postId}`)
            .then(res => res.json())
            .then(result => {
                const likeList = result[0].usersLike;
                const dislikeList = result[0].usersDislike;
                if(likeList != []) {
                    for(let userId of likeList) {
                        console.log('iteration hastheuserliked');
                        if(currentUserId == userId) {
                            console.log('hastheuser liked');
                            return this.hasTheUser = 'liked';
                        }
                    }
                }

                if(dislikeList != []) {
                    for(let userId of dislikeList) {
                        if(currentUserId == userId) {
                            console.log('hastheuser disliked');
                            return this.hasTheUser = 'disliked';
                        }
                    }
                }

                return this.hasTheUser = false
            
            })
            .catch(error => console.log(error))
        },
        isLiked() {
            console.log('isLiked');
            if(this.hasTheUser === 'liked') {
                return this.liked = true;
            } else {
                return this.liked = false;
            }
        },
        isDisliked() {
            console.log('isDisliked');
            if(this.hasTheUser === 'disliked') {
                return this.disliked = true;
            } else {
                return this.disliked = false;
            }
        },
        likeClicked() {
            console.log('likeClicked');
            console.log('in likeclikcked hasthe user: ', this.hasTheUser);
            if(this.hasTheUser === false) {
                console.log('hastheuser false');
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
                .then(res => res.json())
                .then(result => {
                    if(result == {message: 'The user cannot like/dislike the post'}) {
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = 'Vous ne pouvez pas liker cette publication.';
                    } else {
                        this.shownLikeNumber++;
                        this.liked = true;
                        this.hasTheUser = 'liked';
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => console.log('Error likeClicked', err));
            } else if(this.hasTheUser === 'liked') {
                console.log('hastheuser liked');
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
                .then(res => res.json())
                .then(result => {
                    if(result == {message: 'The user cannot like/dislike the post'}) {
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = 'Vous ne pouvez pas déliker cette publication.';
                    } else {
                        this.shownLikeNumber--;
                        this.liked = false;
                        this.hasTheUser = false;
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => console.log('Error likeClicked', err));
            } else {
                console.log('else, error');
                const messagePlace = document.getElementById('likeErrorMessage');
                messagePlace.innerText = 'Vous ne pouvez pas liker cette publication.';
            }
        },
        dislikeClicked() {
            console.log('dislikeclicked');
            if(this.hasTheUser === false) {
                console.log('hastheuser false');
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
                .then(res => res.json())
                .then(result => {
                    if(result == {message: 'The user cannot like/dislike the post'}) {
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = 'Vous ne pouvez pas disliker cette publication.';
                    } else {
                        this.shownDislikeNumber++;
                        this.disliked = true;
                        this.hasTheUser = 'disliked';
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => console.log('Error dislikeClicked', err));
            } else if(this.hasTheUser === 'disliked') {
                console.log('hastheuser disliked');
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
                .then(res => res.json())
                .then(result => {
                    if(result == {message: 'The user cannot like/dislike the post'}) {
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = 'Vous ne pouvez pas dédisliker cette publication.';
                    } else {
                        this.shownDislikeNumber--;
                        this.disliked = false;
                        this.hasTheUser = false;
                        const messagePlace = document.getElementById('likeErrorMessage');
                        messagePlace.innerText = '';
                    }
                })
                .catch(err => console.log('Error dislikeClicked', err));
            } else {
                console.log('else, error');
                const messagePlace = document.getElementById('likeErrorMessage');
                messagePlace.innerText = 'Vous ne pouvez pas disliker cette publication.';
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
                text: this.modelPost,
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
                    if(!result || result.error) {
                        alert('Une erreur s\'est produite');
                    } else {
                        alert('La publication a bien été modifiée!')
                        this.$emit('post-modified');
                        this.modifyClicked = false;
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
                    if(!result || result.error) {
                        alert('Une erreur s\'est produite');
                    } else {
                        alert('La publication a bien été modifiée!')
                        this.$emit('post-modified');
                        this.modifyClicked = false;
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
                console.log('buttons affichés');
                return this.displayButtons = true;
            } else {
                console.log('buttons pas affichés');
                return this.displayButtons = false;
            }
        },
        modConditionsAndAdmin() {
            const currentUserId = JSON.parse(localStorage.getItem('currentUserId'));
            fetch(`http://localhost:3000/api/users/${currentUserId}`)
            .then(res => res.json())
            .then(result => {
                if(parseInt(result.admin.data[0], 10) && this.postModConditions) {
                    return this.displayButtonsAdmin = true;
                } else {
                    return this.displayButtonsAdmin = false;
                }
            })
            .catch(err => console.log('Error ModConditionsAndAdmin', err));
        },
        /*mounted() {
            this.loadData();
        },
        loadData() {
            Promise.all([
                this.loadLikeList(),
                this.loadDislikeList()
            ])
            .then(values => {
                this.likeList = values[0];
                this.dislikeList = values[1];
            })
            .catch(error => console.log('Error loadData', error))
        },
        loadLikeList() {
            return fetch(`http://localhost:3000/api/posts/${this.postId}`)
            .then(res => res.json())
            .then(result => result[0].usersLike)
        },
        loadDislikeList() {
            return fetch(`http://localhost:3000/api/posts/${this.postId}`)
            .then(res => res.json())
            .then(result => result[0].usersDislike)
        }*/
    }
}
</script>

<style lang="scss">
div.published-post {
    display: flex;
    flex-direction: column;
    background-color: #FFD7D7;
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
        border: #002626 solid 2px;
        width: 95%;
        white-space: pre-wrap;
        padding: 0.75em 0.5em;
        align-self: center;
    }
    &>h2 {
        color: #002626;
    }
    &>img {
        width: 95%;
        border: #002626 solid 3px;
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
                border: #002626 solid 1px;
                box-shadow: 2px 2px 3px #0E4749;
                padding: 0.25em 0.5em;
                margin-right: 0.25em;
                &.liked {
                    background-color: #002626;
                    color: white;
                }
                &.not-liked {
                    background-color: white;
                    color: #002626;
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