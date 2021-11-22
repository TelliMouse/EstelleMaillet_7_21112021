<template>
    <div>
        <Header>
            <LoginIcons/>
        </Header>
        <FormSpace
            welcome="Bienvenue!"
            linkTo="Déjà inscrit? C\'est par ici!"
            link="/login">
            <FormSignup/>
        </FormSpace>
    </div>
</template>

<script>
import Header from '../components/Header.vue'
import LoginIcons from '../components/LoginIcons.vue'
import FormSignup from '../components/FormSignup.vue'
import FormSpace from '../components/FormSpace.vue'

export default {
    name: 'Signup',
    components: {
        Header, 
        LoginIcons,
        FormSignup,
        FormSpace
    }
}
</script>

<style>
FormSpace {
    width: 75%;
}
</style>