<template>
    <div>
        <h1>Mon Profil</h1>
        <div v-if="userLoaded">
            <p>Prénom:</p>
            <p>{{ firstname }}</p>
        </div>
        <div v-if="userLoaded">
            <p>Nom:</p>
            <p>{{ lastname }}</p>
        </div>
        <div v-if="userLoaded">
            <p>Email:</p>
            <p>{{ email }}</p>
        </div>
        <button @click="clickDelete">Supprimer mon profil</button>
        <div v-if="deleteClicked">
            <p>Pour valider la suppression de votre profil, veuillez rentrer votre mot-de-passe:</p>
            <label for="password">Mot-de-passe:</label>
            <input name="password" type="password" v-model="password"/>
            <button @click="deleteProfile">Valider la suppression</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProfileInfo',
    data() {
        return {
            user: this.getUser(),
            firstname: '',
            lastname: '',
            email: '',
            deleteClicked: false,
            password: '',
            userLoaded: false
        }
    },
    methods: {
        getUser() {
            const userId = parseInt(localStorage.getItem('currentUserId'), 10);
            console.log('userId:', userId);
            fetch(`http://localhost:3000/api/users/${userId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                this.firstname = result.firstname;
                this.lastname = result.lastname;
                this.email = result.email;
                this.userLoaded = true;
                return this.user = result;
            })
            .catch(error => {
                console.log('Error getUser', error);
                alert('Une erreur s\'est produite');
            })
        },
        clickDelete() {
            this.deleteClicked = true
        },
        deleteProfile() {
            if(this.password) {
                fetch('http://localhost:3000/api/users/password', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Accept": "application/json", 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password
                    })
                })
                .then(res => res.json())
                .then(result => {
                    if(result.message) {
                        alert('L\'email ne correspond à aucun profil');
                    } else if (!result.valid) {
                        alert('Le mot-de-passe entré n\'est pas le bon')
                    } else {
                        const userId = parseInt(localStorage.getItem('currentUserId'), 10);
                        fetch(`http://localhost:3000/api/users/${userId}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        })
                        .then(() => {
                            alert('Votre compte a bien été supprimé');
                            localStorage.clear();
                            this.$router.push('/login');
                        })
                        .catch(error => {
                            console.log('Error deleteProfile', error);
                            alert('Une erreur s\'est produite');
                        })
                    }
                })
                .catch(error => {
                    console.log('Error deleteProfile', error);
                    alert('Une erreur s\'est produite');
                })
            } else {
                alert('Veuillez entrer votre mot-de-passe pour supprimer votre profil');
            }
        }
    }
}
</script>

<style lang="scss">

</style>
