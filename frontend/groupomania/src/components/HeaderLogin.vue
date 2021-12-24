<template>
    <header>
        <img class="desktop" src="../assets/icon-above-font-removebg-preview.png" />
        <img class="phone" src="../assets/icon-removebg-preview.png" />
        <nav>
            <router-link to="/login">
                <fa icon="sign-in-alt"/>
                <p>Se connecter</p>
            </router-link>
            <router-link to="/signup">
                <fa icon="user-plus"/>
                <p>S'inscrire</p>
            </router-link>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'HeaderLogin'
}
</script>

<style lang="scss">
header {
    background-color: #002626;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 7em;
    padding-left: 0.5em;
    &>img {
        max-width: 15em;
    }
    &>nav {
        width: 35%;
        justify-content: space-between;
        &>a {
            text-decoration: none;
            color: #FFD7D7;
        }
    }
}

@media all and (max-width: 767px) { //phone
    .desktop {
        display: none;
    }
    nav {
        display: flex;
        flex-direction: column;
        &>a {
            display: flex;
            flex-direction: row;
            max-height: 50%;
            justify-content: space-around;
            &>svg {
                margin-top: 1em;
            }
        }
    }
}

@media all and (min-width: 768px) { //desktop + tablet
    nav {
        display: flex;
        flex-direction: row;
        &>a {
            display: flex;
            flex-direction: column;
            width: 50%;
            padding-top: 1.5em;
            align-items: center;
        }
    }
    .phone {
        display: none;
    }
}
</style>