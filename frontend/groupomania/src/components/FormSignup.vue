<template>
    <div>
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
        createUser(user) {
            fetch('http://localhost:3000/api/users/signup', {
                method: 'POST',
                headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                },
                body: { user }
            })
            .then(res => res.json())
            .catch(err => console.log('Error createUser', err));
        },
        loginUser(user) {
            fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                },
                body: {
                    email: user.email,
                    password: user.password
                }
            })
            .then(res => res.json())
            .catch(err => console.log('Error loginUser', err));
        },
        retrieveUserList() {
            fetch('http://localhost:3000/api/users')
            .then(res => res.json())
            .catch(err => console.log('Error retrieveUserList', err));
        },
        isTheFormComplete() {
            if(this.firstname && this.lastname && this.email && this.password) {
                return true;
            } else {
                return false;
            }
        },
        isTheEmailUnique() {
            const userList = this.retrieveUserList();
            for(let user of userList) {
                if(user.email === this.email) {
                    return false;
                }
            }
            return true;
        },
        signup() {
            if(this.isTheFormComplete() && this.isTheEmailUnique()) {
                const user = {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password
                };
                this.createUser(user);
                const userId = this.loginUser(user);
                localStorage.setItem('currentUserId', userId);
                this.$router.push({ name: 'Posts'});
            } else {
                alert('Veuillez remplir tous les champs du formulaire et n\'avoir utilisé qu\'une fois votre email');
            }
        }
    }
}
</script>

<style>

</style>