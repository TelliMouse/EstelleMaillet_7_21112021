<template>
    <div>
        <h1 v-if="showing">{{ postTitle }}</h1>
        <input v-if="modifyClicked" type="text" id="changeTitle" v-model="postTitle"/>

        <h2>{{ userName }}</h2>

        <textarea v-if="textPost && showing" name="textarea" readonly rows="5" cols="30" v-model="post"></textarea>
        <textarea v-if="textPost && modifyClicked" name="textarea" rows="5" cols="30" v-model="post"></textarea>

        <img v-if="imagePost && showing" src="{{ imageUrl }}" alt="{{ imageAlt }}"/>

        <label v-if="imagePost && modifyClicked" for="changeImagePost">Si vous souhaitez changer votre image, choisissez un nouveau fichier:</label>
        <input v-if="imagePost && modifyClicked" @input="addFile" type="file" name="image" id="changeImagePost" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg+xml"/>
        <label v-if="imagePost && modifyClicked" for="changeImageAlt">Si vous avez changé votre image, veuillez la décrire en quelques mots:</label>
        <input v-if="imagePost && modifyClicked" type="text" name="image" id="changeImageUrl" placeholder="Exemple: Photographie d'une colline verdoyante devant un ciel bleu sans nuage"/>
        <p v-if="imagePost && modifyClicked">Avoir des textes alternatifs pour vos images permet d'avoir un contenu plus accessible pour les personnes malvoyantes</p>
        <div>
            <div>
                <button><img src="../assets/thumbs-up-solid.svg" alt="Icone de like"/> {{ likeNumber}}</button>
                <button><img src="../assets/thumbs-down-solid.svg" alt="Icon de dislike"/> {{ dislikeNumber }}</button>
            </div>
            <p>{{ date }}</p>
        </div>
        <div>
            <button v-if="modConditions" @click="modifyPost">Modifier</button>
            <button v-if="modConditions || modConditionsAndAdmin" @click="deletePost">Supprimer</button>
            <input/>
        </div>
    </div>
</template>

<script>
import LikesAndButtons from './LikesAndButtons.vue'

export default {
    name: 'Post',
    components: {
        LikesAndButtons
    },
    props: {
        postTitle: String, //
        postTextPost: Boolean, //
        userName: String, //
        postPost: String, //
        imageUrl: String, //
        imageAlt: String, //
        likeNumber: Number, //
        dislikeNumber: Number, //
        date: String, //
        postId: Number, //
        postModConditions: Boolean, //
        postImagePost: Boolean,
        userId: Number //id of the user who made the post
    },
    data() {
        return {
            showing: true, //
            post: this.postPost, //
            modifyClicked: false, //
            textPost: this.postTextPost, //
            imagePost: this.postImagePost, //
            files
        }
    },
    methods: {
        addFile() {
            const input = document.getElementById('changeImagePost');
            this.files = input.files
        },
        modifyPost() {
            const modifiedPost = {
                title: this.postTitle,
                user_id: this.userId,
                text: this.post,
                //faut rajouter la suite
            }
            if(this.files) {
                //faire un put avec un body et un files, dans le body on met modifiedPost
            }
        },
        deletePost() {
            fetch(`http://localhost:3000/api/posts/${this.postId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .catch(err => console.log('Error deletePost', err));
        },
        modConditions() {
            //if currentUserId from localStorage is the same as the id of the owner of the post
            //And if postModCondtions is true
            //return true
            //else
            //return false
        },
        modConditionsAndAdmin() {
            //if currentUserId from storage is an admin
            //And if postModConditions is true
            //return true
            //else
            //return false
        }
    }
}
</script>

<style>

</style>