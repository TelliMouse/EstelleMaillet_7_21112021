<template>
    <header>
        <img class="desktop" src="../assets/icon-above-font-removebg-preview.png" />
        <img class="phone" src="../assets/icon-removebg-preview.png" />
        <nav>
            <router-link to="/profile">
                <fa icon="user-circle" />
                <p>Mon Profil</p>
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
    </header>
</template>

<script>
export default {
    name: 'HeaderPost',
    methods: {
        wipeLocalStorage() {
            localStorage.clear();
        }
    }
}
</script>

<style>
/*Header style defined in component HeaderLogin.vue*/
</style>