<template>
    <header>
        <div class="main-header">
            <img class="desktop" src="../assets/icon-above-font-removebg-preview.png" />
            <img class="phone" src="../assets/icon-removebg-preview.png" />
            <nav class="desktop">
                <router-link :to="{ name: 'Posts', params: { page: 1 } }">
                    <fa icon="home"/>
                    <p>Acceuil</p>
                </router-link>
                <router-link to="/newpost">
                    <fa icon="plus-circle"/>
                    <p>Nouveau Post</p>
                </router-link>
                <router-link to="/login" @click="wipeLocalStorage">
                    <fa icon="sign-out-alt"/>
                    <p>Quitter</p>
                </router-link>
            </nav>
            <div class="phone">
                <button v-if="!navClicked" @click="changeNav">
                    <fa icon="bars" />
                    <p>Navigation</p>
                </button>
                <button v-if="navClicked" @click="changeNav">
                    <fa icon="times" />
                    <p>Fermer Navigation</p>
                </button>
            </div>
        </div>
        <nav class="drop-nav phone" v-if="navClicked">
            <router-link :to="{ name: 'Posts', params: { page: 1 } }">
                <fa icon="home" class="icon"/>
                <p>Acceuil</p>
            </router-link>
            <router-link to="/newpost">
                <fa icon="plus-circle" class="icon"/>
                <p>Nouveau Post</p>
            </router-link>
            <router-link to="/login" @click="wipeLocalStorage">
                <fa icon="sign-out-alt" class="icon"/>
                <p>Quitter</p>
            </router-link>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'HeaderPost',
    data () {
        return {
            navClicked: false
        }
    },
    methods: {
        /**
         * Erase the localStorage, so the item currentUserId doesn't exist anymore
         */
        wipeLocalStorage() {
            localStorage.clear();
        },
        changeNav() {
            this.navClicked = !this.navClicked;
        }
    }
}
</script>

<style>
/*Header style defined in component HeaderLogin.vue*/
</style>