<template>
    <div class="profile-info">
        <h1>Mon Profil</h1>
        <div v-if="userLoaded">
            <p>Prénom:</p>
            <p class="data">{{ firstname }}</p>
        </div>
        <div v-if="userLoaded">
            <p>Nom:</p>
            <p class="data">{{ lastname }}</p>
        </div>
        <div v-if="userLoaded">
            <p>Email:</p>
            <p class="data">{{ email }}</p>
        </div>
        <button @click="clickDelete">Supprimer mon profil</button>
        <div class="delete" v-if="deleteClicked">
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
div.profile-info {
    display: flex;
    flex-direction: column;
    background-color: #D3F6DB;
    width: 85%;
    margin-top: 2em;
    border-radius: 15px/15px;
    padding-left: 0.75em;
    padding-right: 00.75em;
    padding-bottom: 1em;
    &>h1 {
        align-self: center;
    }
    &>div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 1.2em;
        &>p.data {
            color: #4C061D;
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
    &>div.delete {
        display: flex;
        flex-direction: column;
        font-size: 1.1em;
        margin-top: 1em;
        &>p {
            align-self: center;
        }
        &>input {
            border: 2px solid #92D5E6;
            border-radius: 15px/15px;
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
}
</style>
