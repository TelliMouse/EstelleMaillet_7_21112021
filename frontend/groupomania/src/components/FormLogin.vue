<template>
    <div class="form-login">
        <h1>Ravi de vous revoir!</h1>
        <label for="email">Email:</label>
        <input v-model="email" type="email" name="email">
        <label for="password">Mot-de-passe:</label>
        <input v-model="password" type="password" name="password">
        <button @click="login">Se connecter</button>
        <router-link to="/signup">Pas encore inscrit? C'est par ici!</router-link>
    </div>
</template>

<script>
export default {
    name: "FormLogin",
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        /**
         * Verifies if every field of the form is complete
         * @returns {Boolean}
         */
        isTheFormComplete() {
            if(this.email && this.password) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * Authentifies user through a request to the API, set the current user's id to LocalStorage and redirects to the main page
         */
        login() {
            if(this.isTheFormComplete()) {
                const user = {
                    email: this.email,
                    password: this.password
                };
                fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    //credentials is needed to get the cookie back in the browser
                    credentials: 'include',
                    headers: {
                        "Accept": "application/json", 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user)
                })
                //res is a promise, and on this iteration, if you don't use twice .then(), result.id is undefined because res will be pending
                .then(res => res.json())
                .then(result => {
                    console.log('result: ', result);
                    const userId = result.id;
                    console.log('userId: ', userId);
                    if(userId) {
                        localStorage.setItem('currentUserId', userId);

                        this.$router.push({ name: 'Posts'});
                    } else {
                        alert('Une erreur s\'est produite');
                    }
                })
                .catch(err => console.log('Error loginUser', err));
            } else {
                alert('Veuillez remplir tous les champs de saisie!');
            }
            
        }
    }
}
</script>

<style lang="scss">
div.form-login {
    display: flex;
    flex-direction: column;
    background-color: #FFD7D7;
    width: 85%;
    margin-top: 2em;
    border-radius: 15px/15px;
    padding-left: 0.75em;
    padding-right: 00.75em;
    padding-bottom: 1em;
    &>h1 {
        align-self: center;
    }
    &>label {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }
    &>input {
        border-radius: 15px/15px;
        border: 2px solid #002626;
    }
    &>button {
        margin-top: 1em;
        width: 20%;
        align-self: center;
        color: white;
        background-color: #002626;
        border-radius: 15px/15px;
        border: none;
        padding-top: 0.5em;
        padding-bottom: 0.5em;
        box-shadow: 2px 2px 3px #0E4749;
    }
    &>a {
        text-decoration: none;
        color: #002626;
        align-self: center;
        margin-top: 1em;
    }
}
</style>