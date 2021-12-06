<template>
    <header>
        <img src="../assets/icon-left-font-monochrome-black.png" />
        <nav>
            <router-link to="/posts">
                <img class="icon" src="../assets/home-solid.svg"/>
                <p>Acceuil</p>
            </router-link>
            <router-link to="/login" @click="wipeLocalStorage">
                <img class="icon" src="../assets/sign-out-alt-solid.svg"/>
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