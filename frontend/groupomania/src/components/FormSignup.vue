<template>
    <div class="form-signup">
        <h1>Bienvenue!</h1>
        <label for="firstname">Prénom:</label>
        <input v-model="firstname" type="text" name="firstname" required>
        <label for="lastname">Nom:</label>
        <input v-model="lastname" type="text" name="lastname" required>
        <label for="email">Email:</label>
        <input v-model="email" type="email" name="email" required>
        <p class="advice"><fa icon="info-circle" class="icon"/>Vous ne pouvez utiliser votre adresse email qu'une seule fois pour créer un compte</p>
        <label for="password">Mot-de-passe:</label>
        <input v-model="password" type="password" name="password" required>
        <button @click="signup">S'inscrire</button>
        <router-link to="/login">Déjà inscrit? C'est par ici!</router-link>
    </div>
</template>

<script>
export default {
    name: "FormSignup",
    data() {
        return {
            firstname: '',
            lastname: '',
            email: '',
            password: ''
        }
    },
    methods: {
        /**
         * Tests if the email is the right format, "[thing]@[thing].[thing]"
         * @returns {Boolean}
         */
        isEmailCorrect() {
            const regex = /^.+@.+\.[a-z]+$/;
            return regex.test(this.email);
        },
        /**
         * Create a new user through a request to the API
         * @param {Object} user
         * @returns {Json} res.json()
         */
        createUser(user) {
            fetch('http://localhost:3000/api/users/signup', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...user })
            })
            .then(res => res.json())
            .catch(err => {
                console.log('Error createUser', err);
                alert('Une erreur s\'est produite. Veillez à n\'utiliser qu\'une seule fois votre email');
            });
        },
        /**
         * Verifies if all fields of the form are completed
         * @returns {Boolean}
         */
        isTheFormComplete() {
            if(this.firstname && this.lastname && this.email && this.password) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * Authentifies a user though a request to the API, then sets the current user's id in the LocalStorage, and redirects to the main page
         * @param {Object} user
         */
        login(user) {
            fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                //credentials is needed to get the cookie back in the browser
                credentials: 'include',
                headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password
                })
            })
            //res is a promise, and on this iteration, if you don't use twice .then(), result.id is undefined because res will be pending
            .then(res => res.json())
            .then(result => {
                const userId = result.id;
                if(userId) {
                    localStorage.setItem('currentUserId', userId);
                    this.$router.push({ name: 'Posts', params: { page: 1 } });
                } else {
                    alert('Une erreur s\'est produite');
                }
            })
            .catch(err => {
                console.log('Error loginUser', err);
                alert('Une erreur s\'est produite');
            });
        },
        /**
         * Create a new user in the database, then authentifies them with login() (see previous function)
         */
        signup() {
            if(this.isTheFormComplete() && this.isEmailCorrect()) {
                //This first fetch determines if the email is unique, the response's json is as: { unique: Boolean }
                fetch('http://localhost:3000/api/users/email', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Accept": "application/json", 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({email: this.email })
                })
                .then(res => res.json())
                .then(result => {
                    if(result.unique) {
                        const user = {
                            firstname: this.firstname,
                            lastname: this.lastname,
                            email: this.email,
                            password: this.password
                        };
                        //Once we know the email is unique, we can now add the user to the database
                        fetch('http://localhost:3000/api/users/signup', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                "Accept": "application/json", 
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ ...user })
                        })
                        .then(res => res.json())
                        .then(() => this.login(user))
                        .catch(err => {
                            console.log('Error createUser', err);
                            alert('Une erreur s\'est produite. Veillez à n\'utiliser qu\'une seule fois votre email');
                        });
                    } else {
                        alert('Veuillez utiliser une adresse qui n\'est pas utiliséé par un autre compte')
                    }
                })
                .catch(error => {
                    console.log('Error signup', error);
                    alert('Une erreur s\'est produite');
                })
                
            } else if (this.isTheFormComplete && !this.isEmailCorrect()) {
                alert('Veuillez entrer une adresse email valide');
            } else {
                alert('Veuillez remplir tous les champs du formulaire et n\'avoir utilisé qu\'une fois votre email');
            }
        }
    }
}
</script>

<style lang="scss">
div.form-signup {
    display: flex;
    flex-direction: column;
    background-color: #D3F6DB;
    width: 85%;
    margin-top: 2em;
    border-radius: 15px/15px;
    padding-left: 0.75em;
    padding-right: 0.75em;
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
        border: 2px solid #92D5E6;
    }
    &>p.advice {
        text-decoration: underline #4C061D;
        align-self: center;
        &>.icon {
            color: #4C061D;
            margin-right: 0.5em;
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
    &>a {
        text-decoration: none;
        color: #4C061D;
        align-self: center;
        margin-top: 1em;
    }
}
</style>