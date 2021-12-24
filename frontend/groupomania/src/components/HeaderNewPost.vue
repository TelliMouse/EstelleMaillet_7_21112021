<template>
    <header>
        <img src="../assets/icon-left-font-monochrome-black.png" />
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