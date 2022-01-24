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
        /**
         * We find the user in the database and display their infos
         */
        getUser() {
            const userId = parseInt(localStorage.getItem('currentUserId'), 10);
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
        /**
         * Assign true to deleteClicked when the button is clicked
         */
        clickDelete() {
            this.deleteClicked = true
        },
        /**
         * Delete the user from the database, after having verified the validity of the password given
         */
        deleteProfile() {
            if(this.password) {
                //First we verify if the password given is correct
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
                        //Then, we delete the user from the database
                        const userId = parseInt(localStorage.getItem('currentUserId'), 10);
                        fetch(`http://localhost:3000/api/users/${userId}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        })
                        .then(() => {
                            //Then we redirects to the login page, and clear the localStorage to delete the item currentUserId
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
