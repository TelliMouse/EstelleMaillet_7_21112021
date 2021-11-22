<template>
    <header>
        <img src="../assets/icon-left-font-monochrome-black.png" />
        <nav>
            <!--<font-awesome-icon icon="['fas', 'fa-sign-in-alt']" />
            <font-awesome-icon icon="['fas', 'fa-user-plus']" />-->
            <router-link to="/login">
                <img class="icon" src="../assets/sign-in-alt-solid.svg"/>
                <p>Se connecter</p>
            </router-link>
            <router-view/>
            <router-link to="/signup">
                <img class="icon" src="../assets/user-plus-solid.svg"/>
                <p>S'inscrire</p>
            </router-link>
            <router-view/>
        </nav>
    </header>
</template>

<script>
//import { library } from '@fortawesome/fontawesome-svg-core'
//import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

//library.add(faUserPlus)

export default {
    name: 'Header'
}
</script>

<style>
header {
    background-color: #BBC8CA;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

nav {
    display: flex;
    flex-direction: row;
}

img.icon {
    height: 3em;
}

router-link {
    text-decoration: none;
}

/*font-awesome-icon {
    height: 3em;
    color: black;
}*/
</style>