<template>
    <header>
        <img src="../assets/icon-left-font-monochrome-black.png" />
        <nav>
            <router-link to="/newpost">
                <fa icon="plus-circle"/>
                <p>Nouveau Post</p>
            </router-link>
            <router-link to="/login" @click="wipeLocalStorage">
                <fa ison="sign-out-alt"/>
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

</style>