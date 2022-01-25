<template>
    <header>
        <div class="main-header">
            <img class="desktop" src="../assets/icon-above-font-removebg-preview.png" />
            <img class="phone" src="../assets/icon-removebg-preview.png" />
            <nav class="desktop">
                <router-link to="/login">
                    <fa icon="sign-in-alt"/>
                    <p>Se connecter</p>
                </router-link>
                <router-link to="/signup">
                    <fa icon="user-plus"/>
                    <p>S'inscrire</p>
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
            <router-link to="/login">
                <fa icon="sign-in-alt" class="icon"/>
                <p>Se connecter</p>
            </router-link>
            <router-link to="/signup">
                <fa icon="user-plus" class="icon"/>
                <p>S'inscrire</p>
            </router-link>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'HeaderLogin',
    data () {
        return {
            navClicked: false
        }
    },
    methods: {
        changeNav() {
            this.navClicked = !this.navClicked;
        }
    }
}
</script>

<style lang="scss">
header {
    width: 100%;
    min-width: fit-content;
    &>div.main-header {
        background-color: #4C061D;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 7em;
        padding-left: 0.5em;
        &>img {
            max-width: 12em;
        }
    }
}

@media all and (max-width: 767px) { //phone
    .desktop {
        display: none;
    }
    header {
        &>div.main-header {
            &>div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                &>button {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    cursor: pointer;
                    min-width: fit-content;
                    background-color: #4C061D;
                    border: none;
                    margin-right: 1em;
                    height: 100%;
                }
            }
        }
        &>nav.drop-nav {
            display: flex;
            flex-direction: column;
            border: 2px solid #4C061D;
            border-radius: 0 0 15px 15px;
            align-items: center;
            &>a {
                display: flex;
                flex-direction: row;
                align-items: center;
                text-decoration: none;
                color: #4C061D;
                &>.icon {
                    margin-right: 00.75em;
                }
            }
        }
    }
}
@media all and (min-width: 768px) { //desktop + tablet
    .phone {
        display: none;
    }
    header {
        &>div.main-header {
            &>nav {
                display: flex;
                flex-direction: row;
                width: 35%;
                justify-content: space-between;
                min-width: fit-content;
                &>a {
                    display: flex;
                    flex-direction: column;
                    width: 50%;
                    padding-top: 1.5em;
                    align-items: center;
                    text-decoration: none;
                    color: white;
                    cursor: pointer;
                    min-width: fit-content;
                }
            }
        }
    }
}
</style>