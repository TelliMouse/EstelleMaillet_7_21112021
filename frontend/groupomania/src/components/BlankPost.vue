<template>
    <div>
        <label for="title">Titre:</label>
        <input name="title" type="text" id="title" v-model="modelTitle"/>
        <p>Choisissez un type de post:</p>
        <div>
            <input @click="textPostChosen" type="radio" id="text" name="post" value="text" />
            <label for="text">Texte</label>
        </div>
        <div>
            <input @click="imagePostChosen" type="radio" id="image" name="post" value="image" />
            <label for="image">Image</label>
        </div>
        <textarea v-if="textIsChecked" name="post" id="textPost" cols="30" rows="10" placeholder="Rédigez votre post ici!" v-model="modelTextPost"></textarea>
        <div v-if="imageIsChecked">
            <label for="imagePost">Choisissez une image à publier:</label>
            <input @input="addFile" type="file" name="image" id="imagePost" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg+xml" />
            <label for="imageAlt">Veuillez décrire brèvement votre image:</label>
            <input type="text" id="imageAlt" name="imageAlt" placeholder="Exemple: Photographie d'une colline verdoyante devant un ciel bleu sans nuage" v-model="imageAlt"/>
            <p>Avoir des textes alternatifs pour vos images permet d'avoir un contenu plus accessible pour les personnes malvoyantes</p>
        </div>
        <button @click="publishPost">Publier</button>
    </div>
</template>

<script>
export default {
    name: 'BlankPost',
    data() {
        return {
            textIsChecked: true,
            imageIsChecked: false,
            modelTextPost: '',
            files: '',
            imageUrl: '',
            imageAlt: '',
            modelTitle: ''
        }
    },
    methods: {
        /**
         * Set unecessary caracteristics to null
         */
        textPostChosen() {
            this.textIsChecked = true;
            this.imageIsChecked = false;
            this.files = null;
            this.imageUrl = null;
            this.imageAlt = null;
        },
        /**
         * Set unecessary caracteristics to null
         */
        imagePostChosen() {
            this.textIsChecked = false;
            this.imageIsChecked = true;
            this.modelTextPost = null;
        },
        /**
         * Assign the input's files to files, so it can return a truthy value, or null
         */
        addFile() {
            const input = document.getElementById('imagePost');
            this.files = input.files;
        },
        /**
         * Rewrite the current date to match the format 'YYYY-MM-DD HH:MM:SS' of MySQL
         */
        getCurrentDate() {
            const date = new Date(Date.now());
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        },
        /**
         * Retrieve post's values to create a post through the API, then, if successfull, redirects to the main page
         */
        publishPost() {
            const newPost = {
                title: this.modelTitle,
                user_id: parseInt(localStorage.getItem('currentUserId'), 10),
                text: this.modelTextPost,
                imageUrl: this.imageUrl,
                imageAlt: this.imageAlt,
                date: this.getCurrentDate()
            };
            if(this.files) {
                const input = document.getElementById('imagePost');
                const data = new FormData();
                data.append('image', input.files[0]);
                data.append('json', JSON.stringify(newPost));
                fetch('http://localhost:3000/api/posts', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Accept": "application/json"
                    },
                    body: data
                })
                .then(res => {
                    const result = res.json();
                    if(!result) {
                        alert('Une erreur s\'est produite');
                    } else {
                        alert('La publication a bien été enregistrée');
                        this.$router.push('posts');
                    }
                })
            } else {
                fetch('http://localhost:3000/api/posts', {
                    method: 'POST',
                    credentials: 'include', 
                    headers: {
                        "Accept": "application/json", 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newPost)
                })
                .then(res => res.json())
                .then(result => {
                    if(!result) {
                        alert('Une erreur s\'est produite');
                    } else {
                        alert('La publication a bien été enregistrée');
                        this.$router.push('posts');
                    }
                })
                .catch(err => {
                    console.log('Error publishPost', err);
                    alert('Une erreur s\'est produite');
                });
            }
        }
    }
}
</script>

<style>

</style>