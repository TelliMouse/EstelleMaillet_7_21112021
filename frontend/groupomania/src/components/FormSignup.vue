<template>
    <div>
        <h1>Bienvenue!</h1>
        <label for="firstname">Prénom:</label>
        <input v-model="firstname" type="text" name="firstname" required>
        <label for="lastname">Nom:</label>
        <input v-model="lastname" type="text" name="lastname" required>
        <label for="email">Email:</label>
        <input v-model="email" type="email" name="email" required>
        <p>Vous ne pouvez utiliser votre adresse email qu'une seule fois pour créer un compte</p>
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
        };
    },
    methods: {
        /**
         * Create a new user through a request to the API
         * @param {Object} user
         * @returns {Json} res.json()
         */
        createUser(user) {
            fetch('http://localhost:3000/api/users/signup', {
                method: 'POST',
                headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...user })
            })
            .then(res => res.json())
            .catch(err => console.log('Error createUser', err));
        },
        /**
         * Retrieve the list of all users
         * @returns {Json} res.json() -array of all users-
         */
        retrieveUserList() {
            fetch('http://localhost:3000/api/users')
            .then(res => res.json())
            .catch(err => console.log('Error retrieveUserList', err));
        },
        /**
         * Verifies if all field of the form are complete
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
         * Retrieve a list of all users, and verifies if the email inputed isn't already used
         * @returns {Boolean}
         */
        isTheEmailUnique() {
            const userList = this.retrieveUserList();
            if(userList) {
                for(let user of userList) {
                    if(user.email === this.email) {
                        return false;
                    }
                }
            }
            return true;
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
                    this.$router.push({ name: 'Posts'});
                } else {
                    alert('Une erreur s\'est produite');
                }
            })
            .catch(err => console.log('Error loginUser', err));
        },
        /**
         * Create a new user in the database, then authentifies them with login() (see previous function)
         */
        signup() {
            if(this.isTheFormComplete() && this.isTheEmailUnique()) {
                const user = {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password
                };
                this.createUser(user);
                this.login(user);
            } else {
                alert('Veuillez remplir tous les champs du formulaire et n\'avoir utilisé qu\'une fois votre email');
            }
        }
    }
}
</script>

<style>

</style>