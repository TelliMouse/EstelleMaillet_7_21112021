<template>
    <header>
        <img src="../assets/icon-left-font-monochrome-black.png" />
        <nav>
            <router-link to="/newpost">
                <img class="icon" src="../assets/plus-circle-solid.svg"/>
                <p>Nouveau Post</p>
            </router-link>
            <router-link to="/login">
                <img class="icon" src="../assets/sign-out-alt-solid.svg"/>
                <p>Quitter</p>
            </router-link>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'HeaderPost'
}
</script>

<style>

</style>