<template>
    <header>
        <img class="desktop" src="../assets/icon-above-font-removebg-preview.png" />
        <img class="phone" src="../assets/icon-removebg-preview.png" />
        <nav>
            <router-link to="/posts">
                <fa icon="home"/>
                <p>Acceuil</p>
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
    name: 'HeaderNewPost',
    methods: {
        wipeLocalStorage() {
            localStorage.clear();
        }
    }
}
</script>

<style>

</style>