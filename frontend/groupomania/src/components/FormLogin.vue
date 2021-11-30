<template>
    <div>
        <label for="email">Email:</label>
        <input v-model="email" type="email" name="email">
        <label for="password">Mot-de-passe:</label>
        <input v-model="password" type="password" name="password">
        <button @click="login">Se connecter</button>
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
        loginUser(user) {
            fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    "Accept": "application/json", 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password
                })
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
            if(this.email && this.password) {
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
        login() {
            if(this.isTheFormComplete() && this.isTheEmailUnique()) {
                const user = {
                    email: this.email,
                    password: this.password
                };
                const userId = this.loginUser(user);
                localStorage.setItem('currentUserId', userId);
                this.$router.push({ name: 'Posts'});
            }
            
        }
    }
}
</script>

<style>
</style>