<template>
    <div class="blank-post">
        <label for="title">Titre:</label>
        <input name="title" type="text" id="title" v-model="modelTitle" placeholder="Votre titre ici!"/>
        <p>Choisissez un type de post:</p>
        <div class="radio">
            <div>
                <input @click="textPostChosen" type="radio" id="text" name="post" value="text" />
                <label for="text">Texte</label>
            </div>
            <div>
                <input @click="imagePostChosen" type="radio" id="image" name="post" value="image" />
                <label for="image">Image</label>
            </div>
        </div>
        <textarea v-if="textIsChecked" name="post" id="textPost" cols="30" rows="10" placeholder="Rédigez votre post ici!" v-model="modelTextPost"></textarea>
        <div class="image" v-if="imageIsChecked">
            <label for="imagePost">Choisissez une image à publier:</label>
            <input @input="addFile" type="file" name="image" id="imagePost" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg+xml" />
            <label for="imageAlt">Veuillez décrire brèvement votre image:</label>
            <input type="text" id="imageAlt" name="imageAlt" placeholder="Exemple: Photographie d'une colline verdoyante devant un ciel bleu sans nuage" v-model="imageAlt"/>
            <p><fa icon="info-circle" class="icon" />Avoir des textes alternatifs pour vos images permet d'avoir un contenu plus accessible pour les personnes malvoyantes</p>
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
            modelTextPost: null,
            files: null,
            imageUrl: null,
            imageAlt: null,
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
         * Rewrite the current date to match the format 'yyyy-mm-ddThh:mm:ss' of MySQL
         */
        getCurrentDate() {
            const date = new Date(Date.now());
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        },
        /**
         * Retrieve post's values to create a post through the API, then, if successfull, redirects to the main page
         */
        publishPost() {
            if(this.modelTitle) {
                if(this.modelTextPost || this.files) {
                    if(this.files && !this.imageAlt) {
                        alert('Veuillez ajouter une description à votre image')
                    } else {
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
                                    this.$router.push({ name: 'Posts', params: { page: 1 } });
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
                                    this.$router.push({ name: 'Posts', params: { page: 1 } });
                                }
                            })
                            .catch(err => {
                                console.log('Error publishPost', err);
                                alert('Une erreur s\'est produite');
                            });
                        }
                    }
                } else {
                    alert('Veuillez remplir tous les champs de saisies');
                }
            } else {
                alert('Veuillez remplir tous les champs de saisies');
            }
            
        }
    }
}
</script>

<style lang="scss">
div.blank-post {
    display: flex;
    flex-direction: column;
    background-color: #D3F6DB;
    width: 85%;
    border-radius: 15px/15px;
    margin-top: 2em;
    border-radius: 15px/15px;
    padding-left: 0.75em;
    padding-right: 00.75em;
    padding-bottom: 1em;
    &>label {
        font-size: 1.3em;
        margin-top: 00.5em;
        margin-bottom: 00.5em;
    }
    &>input {
        border: 2px solid #92D5E6;
        border-radius: 15px/15px;
    }
    &>p {
        font-size: 1.3em;
    }
    &>div.radio {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        font-size: 1em;
    }
    &>textarea {
        margin-top: 1.5em;
        border: 2px solid #92D5E6;
        border-radius: 15px/15px;
        font-size: 1em;
    }
    &>div.image {
        display: flex;
        flex-direction: column;
        &>label {
            font-size: 1.1em;
            margin-top: 1em;
            margin-bottom: 0.5em;
        }
        &>input#imageAlt {
            border: 2px solid #92D5E6;
            border-radius: 15px/15px;
        }
        &>p {
            font-size: 1em;
            color: #4C061D;
            align-self: center;
            margin-top: 00.25em;
            padding-left: 0.25em;
            padding-right: 00.25em;
            &>.icon {
                margin-right: 00.5em;
            }
        }
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